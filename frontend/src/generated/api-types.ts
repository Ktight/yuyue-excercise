// AUTO-GENERATED — DO NOT EDIT
// Source: contracts/openapi.yaml

export interface paths {
  '/api/attendance/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getAttendance'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postAttendance'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/attendance/bulk/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postAttendanceBulk'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/attendance/{attendance_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        attendance_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchAttendanceAttendanceId'];
    trace?: never;
  };
  '/api/attendance/statistics/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getAttendanceStatistics'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/auth/login/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['authLogin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/auth/refresh/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['authRefresh'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/auth/logout/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['authLogout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/auth/me/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['authGetMe'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['authUpdateMe'];
    trace?: never;
  };
  '/api/auth/change-password/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['authChangePassword'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/body-assessments/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getBodyAssessments'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postBodyAssessments'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/body-assessments/{assessment_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        assessment_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getBodyAssessmentsAssessmentId'];
    put?: never;
    post?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    delete: operations['deleteBodyAssessmentsAssessmentId'];
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchBodyAssessmentsAssessmentId'];
    trace?: never;
  };
  '/api/students/{student_id}/body-assessment-trend/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentsStudentIdBodyAssessmentTrend'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/bookings/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getBookings'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postBookings'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/bookings/{booking_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getBookingsBookingId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/bookings/{booking_id}/confirm/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postBookingsBookingIdConfirm'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/bookings/{booking_id}/cancel/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postBookingsBookingIdCancel'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/uploads/presign/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postUploadsPresign'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/uploads/{upload_id}/complete/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        upload_id: string;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postUploadsUploadIdComplete'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/media/{media_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        media_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    delete: operations['deleteMediaMediaId'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/class-records/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getClassRecords'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postClassRecords'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/class-records/{record_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        record_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getClassRecordsRecordId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchClassRecordsRecordId'];
    trace?: never;
  };
  '/api/class-records/{record_id}/complete/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        record_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postClassRecordsRecordIdComplete'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/class-records/bulk/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postClassRecordsBulk'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/class-templates/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getClassTemplates'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postClassTemplates'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/class-templates/{template_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getClassTemplatesTemplateId'];
    put?: never;
    post?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    delete: operations['deleteClassTemplatesTemplateId'];
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchClassTemplatesTemplateId'];
    trace?: never;
  };
  '/api/companies/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getCompanies'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postCompanies'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/companies/{company_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        company_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getCompaniesCompanyId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchCompaniesCompanyId'];
    trace?: never;
  };
  '/api/companies/{company_id}/activate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        company_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postCompaniesCompanyIdActivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/companies/{company_id}/deactivate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        company_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postCompaniesCompanyIdDeactivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/course-templates/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getCourseTemplates'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postCourseTemplates'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/course-templates/{template_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getCourseTemplatesTemplateId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchCourseTemplatesTemplateId'];
    trace?: never;
  };
  '/api/course-templates/{template_id}/activate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postCourseTemplatesTemplateIdActivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/course-templates/{template_id}/deactivate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postCourseTemplatesTemplateIdDeactivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/dashboards/admin/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getDashboardsAdmin'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/dashboards/trainer/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getDashboardsTrainer'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/dashboards/student/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getDashboardsStudent'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/feedback/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getFeedback'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postFeedback'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/feedback/{feedback_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        feedback_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getFeedbackFeedbackId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchFeedbackFeedbackId'];
    trace?: never;
  };
  '/api/reminders/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getReminders'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/reminders/{reminder_id}/read/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        reminder_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postRemindersReminderIdRead'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/reminders/{reminder_id}/dismiss/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        reminder_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postRemindersReminderIdDismiss'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/reports/preview/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postReportsPreview'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/reports/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getReports'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postReports'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/reports/{report_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getReportsReportId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchReportsReportId'];
    trace?: never;
  };
  '/api/reports/{report_id}/publish/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postReportsReportIdPublish'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/reports/{report_id}/export/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postReportsReportIdExport'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/reports/{report_id}/share/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postReportsReportIdShare'];
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    delete: operations['deleteReportsReportIdShare'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/rooms/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getRooms'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postRooms'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/rooms/{room_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        room_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getRoomsRoomId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchRoomsRoomId'];
    trace?: never;
  };
  '/api/rooms/{room_id}/activate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        room_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postRoomsRoomIdActivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/rooms/{room_id}/deactivate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        room_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postRoomsRoomIdDeactivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/schedules/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getSchedules'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postSchedules'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/schedules/{schedule_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        schedule_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getSchedulesScheduleId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchSchedulesScheduleId'];
    trace?: never;
  };
  '/api/schedules/{schedule_id}/publish/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        schedule_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postSchedulesScheduleIdPublish'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/schedules/{schedule_id}/cancel/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        schedule_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postSchedulesScheduleIdCancel'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/schedules/recurring/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postSchedulesRecurring'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/stores/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStores'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postStores'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/stores/{store_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        store_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStoresStoreId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchStoresStoreId'];
    trace?: never;
  };
  '/api/stores/{store_id}/activate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        store_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postStoresStoreIdActivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/stores/{store_id}/deactivate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        store_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postStoresStoreIdDeactivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/home/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentHome'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/schedules/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentSchedules'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/bookings/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentBookings'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postStudentBookings'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/bookings/{booking_id}/cancel/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postStudentBookingsBookingIdCancel'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/profile/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentProfile'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/body-assessments/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentBodyAssessments'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/class-records/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentClassRecords'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/training-plans/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentTrainingPlans'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/reports/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentReports'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/student/feedback/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postStudentFeedback'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/students/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudents'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postStudents'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/students/{student_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentsStudentId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchStudentsStudentId'];
    trace?: never;
  };
  '/api/students/{student_id}/membership/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentsStudentIdMembership'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchStudentsStudentIdMembership'];
    trace?: never;
  };
  '/api/students/{student_id}/eligibility/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getStudentsStudentIdEligibility'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/health/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getHealth'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/version/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getVersion'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training-plans/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getTrainingPlans'];
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postTrainingPlans'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training-plans/{plan_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getTrainingPlansPlanId'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    patch: operations['patchTrainingPlansPlanId'];
    trace?: never;
  };
  '/api/training-plans/{plan_id}/activate/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postTrainingPlansPlanIdActivate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training-plans/{plan_id}/complete/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    post: operations['postTrainingPlansPlanIdComplete'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/training-plans/{plan_id}/progress/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    /** @description DRAFT：字段、权限边界和关键业务决策需在对应阶段冻结后方可联调。 */
    get: operations['getTrainingPlansPlanIdProgress'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/users/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['usersList'];
    put?: never;
    /** @description company_id 由服务端权限范围确定；store_manager 必须有 store_id，trainer 可选，其余角色禁止非空 store_id。 */
    post: operations['usersCreate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/users/{user_id}/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        user_id: number;
      };
      cookie?: never;
    };
    get: operations['usersRetrieve'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['usersUpdate'];
    trace?: never;
  };
  '/api/users/{user_id}/reset-password/': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        user_id: number;
      };
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['usersResetPassword'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    User: {
      /** Format: int64 */
      readonly id: number;
      phone: string;
      name: string;
      role: components['schemas']['UserRole'];
      /** Format: uri */
      avatar: string | null;
      /** Format: int64 */
      company_id: number | null;
      /** Format: int64 */
      store_id: number | null;
      is_active: boolean;
    };
    LoginRequest: {
      phone: string;
      password: string;
    };
    TokenData: {
      access_token: string;
      refresh_token: string;
      /** @enum {string} */
      token_type: 'Bearer';
      /** @enum {integer} */
      expires_in: 1800;
      /** @enum {integer} */
      refresh_expires_in: 604800;
    };
    LoginData: {
      access_token: string;
      refresh_token: string;
      /** @enum {string} */
      token_type: 'Bearer';
      /** @enum {integer} */
      expires_in: 1800;
      /** @enum {integer} */
      refresh_expires_in: 604800;
      user: components['schemas']['User'];
    };
    LoginSuccessResponse: {
      /** @enum {string} */
      code: 'OK';
      message: string;
      data: components['schemas']['LoginData'];
    };
    TokenRefreshRequest: {
      refresh_token: string;
    };
    TokenRefreshSuccessResponse: {
      /** @enum {string} */
      code: 'OK';
      message: string;
      data: components['schemas']['TokenData'];
    };
    LogoutRequest: {
      refresh_token: string;
    };
    MeUpdateRequest: {
      name?: string;
      /** Format: uri */
      avatar?: string | null;
    };
    PasswordChangeRequest: {
      old_password: string;
      /** @description 同 Django 密码校验器规则 */
      new_password: string;
    };
    UserSuccessResponse: {
      /** @enum {string} */
      code: 'OK';
      message: string;
      data: components['schemas']['User'];
    };
    UserCreateRequest: {
      phone: string;
      name: string;
      password: string;
      role: components['schemas']['UserRole'];
      /** Format: int64 */
      store_id?: number | null;
      /** @default true */
      is_active: boolean;
    };
    UserUpdateRequest: {
      name?: string;
      role?: components['schemas']['UserRole'];
      /** Format: int64 */
      store_id?: number | null;
      is_active?: boolean;
    };
    ResetPasswordRequest: {
      new_password: string;
    };
    UserListData: {
      items: components['schemas']['User'][];
      page: number;
      page_size: number;
      total: number;
    };
    UserListSuccessResponse: {
      /** @enum {string} */
      code: 'OK';
      message: string;
      data: components['schemas']['UserListData'];
    };
    ErrorResponse: {
      code: components['schemas']['ErrorCode'];
      message: string;
      errors: {
        [key: string]: string[];
      };
      request_id: string;
    };
    /** @enum {string} */
    ErrorCode:
      | 'VALIDATION_ERROR'
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'CONFLICT'
      | 'RATE_LIMITED'
      | 'INTERNAL_ERROR'
      | 'INVALID_CREDENTIALS'
      | 'ACCOUNT_DISABLED'
      | 'REFRESH_TOKEN_INVALID'
      | 'OLD_PASSWORD_INCORRECT'
      | 'PHONE_ALREADY_EXISTS'
      | 'USER_NOT_FOUND'
      | 'STORE_NOT_FOUND'
      | 'STORE_REQUIRED_FOR_ROLE'
      | 'STORE_NOT_ALLOWED_FOR_ROLE'
      | 'CROSS_TENANT_ACCESS_DENIED'
      | 'SCHEDULE_TIME_CONFLICT'
      | 'ROOM_TIME_CONFLICT'
      | 'TRAINER_TIME_CONFLICT'
      | 'SCHEDULE_NOT_BOOKABLE'
      | 'BOOKING_CAPACITY_FULL'
      | 'BOOKING_ALREADY_EXISTS'
      | 'MEMBERSHIP_EXPIRED'
      | 'MEMBERSHIP_BALANCE_INSUFFICIENT'
      | 'BOOKING_CANCELLATION_DEADLINE_PASSED'
      | 'ATTENDANCE_ALREADY_RECORDED'
      | 'ATTENDANCE_TOO_EARLY'
      | 'CLASS_RECORD_ALREADY_COMPLETED'
      | 'CLASS_RECORD_EDIT_FORBIDDEN'
      | 'BULK_OPERATION_FAILED'
      | 'FILE_TYPE_NOT_ALLOWED'
      | 'FILE_TOO_LARGE'
      | 'UPLOAD_NOT_COMPLETED'
      | 'REPORT_NOT_READY'
      | 'EXPORT_IN_PROGRESS'
      | 'SHARE_LINK_EXPIRED'
      | 'SHARE_LINK_REVOKED';
    EmptySuccessResponse: {
      /** @enum {string} */
      code: 'OK';
      message: string;
      data: unknown;
    };
    /** @description DRAFT 模块的资源结构由对应领域 Schema 细化；冻结前禁止真实联调。 */
    DraftResource: {
      [key: string]: unknown;
    };
    /** @description DRAFT 请求骨架；冻结时必须替换为模块专用 Create/Update Request。 */
    DraftWriteRequest: Record<string, never>;
    DraftSuccessResponse: {
      /** @enum {string} */
      code: 'OK';
      message: string;
      data: components['schemas']['DraftResource'];
    };
    DraftListData: {
      items: components['schemas']['DraftResource'][];
      page: number;
      page_size: number;
      total: number;
    };
    DraftListSuccessResponse: {
      /** @enum {string} */
      code: 'OK';
      message: string;
      data: components['schemas']['DraftListData'];
    };
    PaginationMeta: {
      page: number;
      page_size: number;
      total: number;
    };
    /** Format: int64 */
    Id: number;
    Money: string;
    /** @enum {string} */
    ResourceStatus: 'active' | 'inactive';
    /** @enum {string} */
    UserRole: 'super_admin' | 'company_admin' | 'store_manager' | 'trainer' | 'student';
    /** @enum {string} */
    Gender: 'male' | 'female';
    UserSummary: {
      id: components['schemas']['Id'];
      name: string;
    };
    CompanySummary: {
      id: components['schemas']['Id'];
      name: string;
    };
    StoreSummary: {
      id: components['schemas']['Id'];
      name: string;
    };
    RoomSummary: {
      id: components['schemas']['Id'];
      name: string;
    };
    TrainerSummary: components['schemas']['UserSummary'];
    StudentSummary: {
      id: components['schemas']['Id'];
      name: string;
    };
    CourseTemplateSummary: {
      id: components['schemas']['Id'];
      name: string;
    };
    ScheduleSummary: {
      id: components['schemas']['Id'];
      /** Format: date-time */
      starts_at: string;
      /** Format: date-time */
      ends_at: string;
    };
    MediaResource: {
      id: components['schemas']['Id'];
      /** @enum {string} */
      media_type: 'image' | 'video';
      /** Format: uri */
      url: string;
    };
    CourseTemplate: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      name: string;
      /** @enum {string} */
      category: 'private' | 'small_group' | 'group';
      /** @enum {string} */
      difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
      duration_minutes: number;
      capacity: number;
      description: string | null;
      cover: components['schemas']['MediaResource'];
      status: components['schemas']['ResourceStatus'];
    };
    ClassTemplate: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      company_id: number;
      /** Format: int64 */
      owner_id: number;
      name: string;
      /** @enum {string} */
      scope: 'personal' | 'company';
      content_items: Record<string, never>[];
    };
    Company: {
      /** Format: int64 */
      readonly id: number;
      name: string;
      address: string;
      contact_name: string;
      contact_phone: string;
      status: components['schemas']['ResourceStatus'];
      /** Format: date-time */
      readonly created_at: string;
      /** Format: date-time */
      readonly updated_at: string;
    };
    Store: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      company_id: number;
      name: string;
      address: string;
      status: components['schemas']['ResourceStatus'];
      /** Format: date-time */
      readonly created_at: string;
      /** Format: date-time */
      readonly updated_at: string;
    };
    Room: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      store_id: number;
      name: string;
      capacity: number;
      description: string | null;
      status: components['schemas']['ResourceStatus'];
    };
    TrainingPlan: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      student_id: number;
      /** Format: int64 */
      trainer_id: number;
      name: string;
      /** Format: date */
      starts_on: string;
      /** Format: date */
      ends_on: string;
      /** @enum {string} */
      status: 'draft' | 'active' | 'completed' | 'cancelled';
      stages: Record<string, never>[];
    };
    Feedback: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      class_record_id: number;
      /** Format: int64 */
      student_id: number;
      /** @enum {string} */
      feeling: 'great' | 'good' | 'normal' | 'tired' | 'uncomfortable';
      rating: number;
      comment: string | null;
      media: components['schemas']['MediaResource'][];
      /** Format: date-time */
      readonly created_at: string;
    };
    Attendance: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      schedule_id: number;
      /** Format: int64 */
      student_id: number;
      /** @enum {string} */
      status: 'present' | 'late' | 'absent' | 'leave';
      /** Format: date-time */
      recorded_at: string;
    };
    ClassRecord: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      schedule_id: number;
      /** Format: int64 */
      student_id: number;
      /** Format: int64 */
      trainer_id: number;
      content: string;
      goals: string;
      completion: string;
      trainer_notes: string | null;
      student_performance: string | null;
      /** @enum {string} */
      status: 'draft' | 'completed';
      media: components['schemas']['MediaResource'][];
    };
    BulkOperationResult: {
      succeeded: number;
      failed: number;
      items: Record<string, never>[];
    };
    Upload: {
      upload_id: string;
      /** Format: uri */
      upload_url: string;
      /** Format: date-time */
      expires_at: string;
      /** @enum {string} */
      status: 'pending' | 'uploaded' | 'failed' | 'deleted';
    };
    Report: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      student_id: number;
      /** Format: date */
      range_start: string;
      /** Format: date */
      range_end: string;
      /** @enum {string} */
      status: 'draft' | 'generated' | 'published' | 'archived';
      /** Format: date-time */
      snapshot_at: string;
    };
    DashboardMetric: {
      key: string;
      value: string;
      unit: string;
      /** Format: date */
      range_start: string;
      /** Format: date */
      range_end: string;
      /** Format: date-time */
      updated_at: string;
    };
    Reminder: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      company_id: number;
      /** @enum {string} */
      type:
        'membership_expiring' | 'inactive_student' | 'class_record_draft' | 'training_plan_overdue';
      /** @enum {string} */
      severity: 'info' | 'warning' | 'critical';
      /** @enum {string} */
      status: 'unread' | 'read' | 'dismissed';
      title: string;
      message: string;
      /** Format: date-time */
      created_at: string;
    };
    Schedule: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      store_id: number;
      /** Format: int64 */
      room_id: number;
      /** Format: int64 */
      trainer_id: number;
      /** Format: int64 */
      course_template_id: number;
      /** Format: date-time */
      starts_at: string;
      /** Format: date-time */
      ends_at: string;
      /** @example Asia/Shanghai */
      timezone: string;
      capacity: number;
      /** @enum {string} */
      status: 'draft' | 'published' | 'completed' | 'cancelled';
    };
    Booking: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      schedule_id: number;
      /** Format: int64 */
      student_id: number;
      /** @enum {string} */
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
      /** @enum {string} */
      source: 'admin' | 'trainer' | 'student' | 'system';
      /** Format: date-time */
      readonly created_at: string;
    };
    RecurringScheduleRequest: {
      idempotency_key: string;
      schedule: components['schemas']['Schedule'];
      /** @description RFC 5545 风格重复规则；DRAFT 待冻结 */
      recurrence: Record<string, never>;
    };
    Membership: {
      /** @enum {string} */
      card_type: 'count' | 'month' | 'quarter' | 'year' | 'stored';
      /** @enum {string} */
      status: 'active' | 'expired' | 'suspended' | 'exhausted';
      /** Format: date */
      expires_on: string | null;
      remaining_count: number | null;
      balance: components['schemas']['Money'];
    };
    Student: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      user_id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      store_id: number | null;
      /** Format: int64 */
      trainer_id: number | null;
      name: string;
      phone: string;
      /** @enum {string} */
      gender: 'male' | 'female';
      /** Format: date */
      birthday: string | null;
      goals: string | null;
      /** @description 敏感字段，仅授权角色可见 */
      health_notes: string | null;
      membership: components['schemas']['Membership'];
      status: components['schemas']['ResourceStatus'];
    };
    BodyAssessment: {
      /** Format: int64 */
      readonly id: number;
      /** Format: int64 */
      readonly company_id: number;
      /** Format: int64 */
      student_id: number;
      /** Format: date-time */
      assessed_at: string;
      height_cm: string;
      weight_kg: string;
      measurements_cm: {
        [key: string]: string;
      };
      scores: {
        [key: string]: number;
      };
    };
  };
  responses: {
    /** @description 内部错误，不泄露 traceback 或配置 */
    ServerError: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description 请求参数或业务校验失败 */
    BadRequest: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description 权限不足 */
    Forbidden: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description 未认证或令牌无效 */
    Unauthorized: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description 资源不存在或为避免跨租户枚举而隐藏 */
    NotFound: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description 唯一性或资源状态冲突 */
    Conflict: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
  };
  parameters: {
    PageParameter: number;
    PageSizeParameter: number;
    SearchParameter: string;
    OrderingParameter: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  getAttendance: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postAttendance: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postAttendanceBulk: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchAttendanceAttendanceId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        attendance_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getAttendanceStatistics: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  authLogin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['LoginRequest'];
      };
    };
    responses: {
      /** @description 登录成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['LoginSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      500: components['responses']['ServerError'];
    };
  };
  authRefresh: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['TokenRefreshRequest'];
      };
    };
    responses: {
      /** @description 轮换成功，旧 Refresh Token 立即失效 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['TokenRefreshSuccessResponse'];
        };
      };
      401: components['responses']['Unauthorized'];
      500: components['responses']['ServerError'];
    };
  };
  authLogout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['LogoutRequest'];
      };
    };
    responses: {
      /** @description Refresh Token 已撤销 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptySuccessResponse'];
        };
      };
      401: components['responses']['Unauthorized'];
      500: components['responses']['ServerError'];
    };
  };
  authGetMe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 当前用户 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserSuccessResponse'];
        };
      };
      401: components['responses']['Unauthorized'];
      500: components['responses']['ServerError'];
    };
  };
  authUpdateMe: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['MeUpdateRequest'];
      };
    };
    responses: {
      /** @description 更新后的当前用户 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      500: components['responses']['ServerError'];
    };
  };
  authChangePassword: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['PasswordChangeRequest'];
      };
    };
    responses: {
      /** @description 密码修改成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptySuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      500: components['responses']['ServerError'];
    };
  };
  getBodyAssessments: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postBodyAssessments: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getBodyAssessmentsAssessmentId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        assessment_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  deleteBodyAssessmentsAssessmentId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        assessment_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptySuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchBodyAssessmentsAssessmentId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        assessment_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentsStudentIdBodyAssessmentTrend: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getBookings: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postBookings: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getBookingsBookingId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postBookingsBookingIdConfirm: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postBookingsBookingIdCancel: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postUploadsPresign: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postUploadsUploadIdComplete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        upload_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  deleteMediaMediaId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        media_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptySuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getClassRecords: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postClassRecords: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getClassRecordsRecordId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        record_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchClassRecordsRecordId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        record_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postClassRecordsRecordIdComplete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        record_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postClassRecordsBulk: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getClassTemplates: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postClassTemplates: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getClassTemplatesTemplateId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  deleteClassTemplatesTemplateId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptySuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchClassTemplatesTemplateId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getCompanies: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postCompanies: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getCompaniesCompanyId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        company_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchCompaniesCompanyId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        company_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postCompaniesCompanyIdActivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        company_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postCompaniesCompanyIdDeactivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        company_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getCourseTemplates: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postCourseTemplates: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getCourseTemplatesTemplateId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchCourseTemplatesTemplateId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postCourseTemplatesTemplateIdActivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postCourseTemplatesTemplateIdDeactivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        template_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getDashboardsAdmin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getDashboardsTrainer: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getDashboardsStudent: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getFeedback: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postFeedback: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getFeedbackFeedbackId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        feedback_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchFeedbackFeedbackId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        feedback_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getReminders: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postRemindersReminderIdRead: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        reminder_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postRemindersReminderIdDismiss: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        reminder_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postReportsPreview: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getReports: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postReports: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getReportsReportId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchReportsReportId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postReportsReportIdPublish: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postReportsReportIdExport: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postReportsReportIdShare: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  deleteReportsReportIdShare: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        report_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptySuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getRooms: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postRooms: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getRoomsRoomId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        room_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchRoomsRoomId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        room_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postRoomsRoomIdActivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        room_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postRoomsRoomIdDeactivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        room_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getSchedules: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postSchedules: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getSchedulesScheduleId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        schedule_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchSchedulesScheduleId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        schedule_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postSchedulesScheduleIdPublish: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        schedule_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postSchedulesScheduleIdCancel: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        schedule_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postSchedulesRecurring: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStores: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postStores: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStoresStoreId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        store_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchStoresStoreId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        store_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postStoresStoreIdActivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        store_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postStoresStoreIdDeactivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        store_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentHome: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentSchedules: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentBookings: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postStudentBookings: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postStudentBookingsBookingIdCancel: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        booking_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentProfile: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentBodyAssessments: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentClassRecords: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentTrainingPlans: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentReports: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postStudentFeedback: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudents: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postStudents: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentsStudentId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchStudentsStudentId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentsStudentIdMembership: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchStudentsStudentIdMembership: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getStudentsStudentIdEligibility: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        student_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getHealth: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getVersion: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getTrainingPlans: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postTrainingPlans: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getTrainingPlansPlanId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  patchTrainingPlansPlanId: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postTrainingPlansPlanIdActivate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  postTrainingPlansPlanIdComplete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['DraftWriteRequest'];
      };
    };
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  getTrainingPlansPlanIdProgress: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        plan_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 成功 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['DraftSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  usersList: {
    parameters: {
      query?: {
        page?: components['parameters']['PageParameter'];
        page_size?: components['parameters']['PageSizeParameter'];
        search?: components['parameters']['SearchParameter'];
        role?: components['schemas']['UserRole'];
        is_active?: boolean;
        store_id?: number;
        ordering?: 'name' | '-name' | 'id' | '-id';
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 分页用户 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserListSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      500: components['responses']['ServerError'];
    };
  };
  usersCreate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UserCreateRequest'];
      };
    };
    responses: {
      /** @description 用户创建成功 */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      409: components['responses']['Conflict'];
      500: components['responses']['ServerError'];
    };
  };
  usersRetrieve: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        user_id: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description 用户详情 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserSuccessResponse'];
        };
      };
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      500: components['responses']['ServerError'];
    };
  };
  usersUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        user_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UserUpdateRequest'];
      };
    };
    responses: {
      /** @description 更新后的用户 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['UserSuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      500: components['responses']['ServerError'];
    };
  };
  usersResetPassword: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        user_id: number;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ResetPasswordRequest'];
      };
    };
    responses: {
      /** @description 密码已重置 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['EmptySuccessResponse'];
        };
      };
      400: components['responses']['BadRequest'];
      401: components['responses']['Unauthorized'];
      403: components['responses']['Forbidden'];
      404: components['responses']['NotFound'];
      500: components['responses']['ServerError'];
    };
  };
}
