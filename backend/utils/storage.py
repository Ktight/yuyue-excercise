"""Storage helpers for class media uploads."""

from pathlib import Path
from urllib.parse import urljoin
from uuid import uuid4

from django.conf import settings
from django.core.files.storage import FileSystemStorage, default_storage
from PIL import Image, ImageOps


def get_upload_path(instance, filename):
    """Build a tenant-scoped, collision-resistant relative upload path."""
    company_id = getattr(instance, 'company_id', None)
    if company_id is None and getattr(instance, 'class_record', None) is not None:
        company_id = instance.class_record.company_id
    if company_id is None:
        raise ValueError('Upload instance must provide company_id.')

    entity = getattr(instance, 'entity', None)
    if not entity and getattr(instance, '_meta', None) is not None:
        entity = instance._meta.model_name
    if not entity:
        entity = instance.__class__.__name__.lower()

    extension = Path(filename).suffix.lower().lstrip('.')
    generated_name = str(uuid4())
    if extension:
        generated_name = f'{generated_name}.{extension}'
    return f'{company_id}/{entity}/{generated_name}'


def get_media_storage():
    """Return local storage in development and the configured backend otherwise.

    Production deployments can provide an object-storage implementation through
    Django's ``STORAGES['default']`` setting without changing upload views.
    """
    if settings.DEBUG:
        return FileSystemStorage(
            location=settings.MEDIA_ROOT,
            base_url=settings.MEDIA_URL,
        )
    return default_storage


def generate_thumbnail(image_path, size=(300, 300)):
    """Create a JPEG thumbnail beside a local image and return its media URL."""
    media_root = Path(settings.MEDIA_ROOT).resolve()
    source_path = Path(image_path).resolve()
    try:
        relative_source = source_path.relative_to(media_root)
    except ValueError as exc:
        raise ValueError('Image path must be inside MEDIA_ROOT.') from exc

    thumbnail_relative = (
        relative_source.parent
        / 'thumbnails'
        / f'{relative_source.stem}_thumbnail.jpg'
    )
    thumbnail_path = media_root / thumbnail_relative
    thumbnail_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as source_image:
        image = ImageOps.exif_transpose(source_image)
        image.thumbnail(size, Image.Resampling.LANCZOS)
        if image.mode not in ('RGB', 'L'):
            background = Image.new('RGB', image.size, 'white')
            if 'A' in image.getbands():
                background.paste(image, mask=image.getchannel('A'))
            else:
                background.paste(image)
            image = background
        elif image.mode == 'L':
            image = image.convert('RGB')
        image.save(thumbnail_path, format='JPEG', quality=85, optimize=True)

    media_base = f"{settings.MEDIA_URL.rstrip('/')}/"
    return urljoin(media_base, thumbnail_relative.as_posix())
