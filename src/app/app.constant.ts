let userManagement = 'user-management/api/v1/users';
let ownerManagement = 'owner-management/api/v1/owners';
let ownerSelfReg = 'owner-management/api/v1/self-registration';
let ownerSetting = 'owner-management/api/v1/owner-settings/'
let vendorManagement = 'vendor-management/api/v1/vendors';
let searchCis = 'search/api/v1/cis';

export const PATH = {
  // User Management
  LOGIN: userManagement+'/signIn',
  GET_ASSOCIATION:userManagement+'/associations',
  GET_LOGGEDIN_USER:userManagement+'/loggedInUser',
  USER_SET_PASSWORD:userManagement+'/password',

  // Owner Management
  OWNER: ownerManagement,

  // Vendor Management
  VENDOR: vendorManagement,

  // Owner Self Registration
  OWNER_SELF_REGISTRATION:ownerSelfReg,

  // Owner Settings Controller
  SETTING_ESG:ownerSetting+'esg',
  QUESTIONNAIRE:ownerSetting+'questions',
  SURVEYS:ownerSetting+'survey',
  VENDOR_SETTINGS:ownerSetting+'vendor-settings',
  REGULATIONS_Documents:'',

  // Search CIS
  SEARCH_CIS:searchCis,
 

  GET_USER_FORGOT_PASSWORD:'user-management/api/v1/users/forget-password?userName=',
  FORGOT_PASSWORD:'user-management/api/v1/users/password',
  UPDATE_USER:'user-management/api/v1/users',
  GET_USER:'user-management/api/v1/users',
  

  GET_ALL_COUNTRIES:'agent-management/api/v1/countries',
  COMPANY_INFORMATION: 'agent-management/api/v1/company-information',
  SAVE_COMPANY_INFORMATION: 'agent-management/api/v1/company-information/save',

  VENDOR_ID_INFO: 'agent-management/api/v1/company-information/dashboard/esg',

  GET_VENDOR_SETTINGS: 'agent-management/api/v1/vendor/settings',
  GET_DROPDOWNS: 'agent-management/api/v1/dropdowns',
  UPDATE_DOCUMENTS:'agent-management/api/v1/companyInformation/document/',
  AUDIT_HISTORY: 'agent-management/api/v1/auditInformation/',
  FILE_UPLOAD: 'agent-management/api/v1/s3Files',
  GET_UPLOADED_FILE: 'agent-management/api/v1/s3Files?fileName=',
  VENDOR_QUESTIONS: 'agent-management/api/v1/companies/questions/vendor',
  VENDOR_ESG: 'agent-management/api/v1/companies/esg/vendor',
  GET_FILE: 'agent-management/api/v1/files/get?objectName=',
  DELETE_FILE: 'agent-management/api/v1/files/delete?fileName=',
  NOTES_SUBMIT:'agent-management/api/v1/notes',
  GET_SUBMIT:'agent-management/api/v1/notes',
  GET_REGULATIONS:'agent-management/api/v1/vendor/setting/regulations-document',
  INVITE_CUSTOMER:'agent-management/api/v1/customers/invite',
  REGISTER_COMPANY_ADMIN:'agent-management/api/v1/companies/admin/register',
  BULK_REGISTER_COMPANY_ADMIN:'agent-management/api/v1/companies/admin/bulk-register',
  REGISTER_COMPANY_SELF:'agent-management/api/v1/companies/register',
  INVITE_VENDOR:'agent-management/api/v1/vendor/invite',
  APPROVE_PENDING_USER:'agent-management/api/v1/companies/approve/',
  ACTIVATION_PENDING_USERS:'agent-management/api/v1/companies/status/',
  GET_ALL_COMPANIES:'agent-management/api/v1/companies',
  REGISTRATION_STATUS:'agent-management/api/v1/admin/registrationStats',
  REGISTRATION_STATUS_VENDOR:'agent-management/api/v1/companies/vendor/registrationStats',
  GET_USER_BY_ID:'agent-management/api/v1/companies/id/',
  VERIFYINVITATIONEMAIL:'agent-management/api/v1/invite-email',
  GET_ALL_VENDOR:'agent-management/api/v1/vendor',
  GET_LOGGEDIN_COMPANY:'agent-management/api/v1/companies/loggedInCompany',
  GET_COMPANY_DETAILS:'agent-management/api/v1/companies/basic-details',
  GET_VENDOR_DETAILS:'agent-management/api/v1/vendor/loggedInVendor',
  COMPANY_BASIC_DETAILS:'agent-management/api/v1/companies/basic-details',
  
  
  GET_COMPANY_BY_ID:'agent-management/api/v1/companies/id/',
  
  USER_MANAGEMENT:'agent-management/api/v1/companies/users',
  VENDOR_USER_MANAGEMENT:'agent-management/api/v1/vendor/users',
  VENDOR_ACTIVE_INACTIVE:'agent-management/api/v1/vendor/customer/',
  CUSTOMER_ACTIVE_INACTIVE:'agent-management/api/v1/companies/admin/',
  GET_CUSTOMER_COMPANY_INFORMATION:'agent-management/api/v1/company-information',
  
  
  SURVEY_INVITE:"agent-management/api/v1/companies/survey/invite",
  GET_APPROVE_DATA:"agent-management/api/v1/company-information/status",
  RFI:"agent-management/api/v1/company-information/rfi",
 
  GET_VENDOR_BULK_INVITES:"agent-management/api/v1/s3Files",
  POST_VENDOR_BULK_INVITES:"agent-management/api/v1/vendor/bulk-invites",

  POST_CUSTOMER_BULK_INVITES:"agent-management/api/v1/companies/bulk-invites",

  DASHBOARD_COUNT:'agent-management/api/v1/company-information/vendor/dashboard/count',
  DASHBOARD_BASIC_DETAILS:'agent-management/api/v1/companies/vendor/basic-details',
 
  GET_OCR:'agent-management/api/v1/ocr/compare-extracted-data/',
  OCR_EXTRACT:'agent-management/api/v1/ocr/extract-data',

  GET_VENDOR_SURVEY:'agent-management/api/v1/vendor/survey',
  
  GET_DASHBOARD_ESG:'agent-management/api/v1/company-information/dashboard/esgScore',
  GET_DASHBOARD_COMPLIANCE_RISK:'agent-management/api/v1/companies/dashboard/complianceRisk',

  GET_SEARCH_CIS:'search/api/v1/cis',
  GET_SEARCH_CIS_BY_ID:'search/api/v1/cis/data-summary',
  GET_CIS_RECORDS:'search/api/v1/cis/search-data',

  GET_FINANCIAL_DATA:'search/api/v1/cis/financial-data',
  GET_SEEK_FINANCIAL_DATA:'search/api/v1/cis/seek-financial-data',

  APPROVE_COMPANY_STATUS:'agent-management/api/v1/companies/approveStatus/',

};

export const SERVER_PATHS = {
  // http://ae4896cb06f214e8b966d3dd99c1b6d6-f70b869d6a261f9c.elb.eu-west-2.amazonaws.com:8080/
  DEV: '//af66f98aebf704faa9bf95786a83d69b-81a1d6555f8bcc1b.elb.eu-west-2.amazonaws.com:8080/',
  // DEV_SEARCH: '//af66f98aebf704faa9bf95786a83d69b-81a1d6555f8bcc1b.elb.eu-west-2.amazonaws.com:8080/'
};
