// Translation strings for English and Japanese

const translations = {
  en: {
    // Common
    'dashboard': 'Dashboard',
    'logout': 'Logout',
    'login': 'Login',
    'email': 'Email',
    'password': 'Password',
    'name': 'Name',
    'role': 'Role',
    'roles': 'Roles',
    'language': 'Language',
    'status': 'Status',
    'actions': 'Actions',
    'active': 'Active',
    'inactive': 'Inactive',
    'edit': 'Edit',
    'delete': 'Delete',
    'cancel': 'Cancel',
    'save': 'Save',
    'submit': 'Submit',
    'create': 'Create',
    'update': 'Update',
    'add': 'Add',
    'remove': 'Remove',
    'search': 'Search',
    'filter': 'Filter',
    'noData': 'No data found',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'required': 'Required',
    'optional': 'Optional',
    
    // User Management
    'addNewUser': 'Add New User',
    'editUser': 'Edit User',
    'manageUsers': 'Manage Users',
    'userManagement': 'User Management',
    'mobile': 'Mobile',
    'address': 'Address',
    'region': 'Region',
    'iamShortId': 'Short ID',
    'ssoId': 'SSO ID',
    'activate': 'Activate',
    'deactivate': 'Deactivate',
    'changePassword': 'Change Password',
    'newPassword': 'New Password',
    'passwordRequired': 'Password is required',
    'passwordMinLength': 'Password must be at least 6 characters',
    'nameRequired': 'Name is required',
    'emailRequired': 'Email is required',
    'roleRequired': 'Role is required',
    'regionRequired': 'Region is required for RC and GD users',
    'otherRoles': 'Other Roles (Select One)',
    'rcGdRoles': 'RC / GD Roles (Can Select Both)',
    'optionalFields': 'Optional Fields',
    'enterMobileNumber': 'Enter mobile number',
    'enterIamShortId': 'Enter IAM Short ID',
    'enterRegion': 'Enter region',
    'enterAddress': 'Enter address',
    'leaveBlankToKeepCurrent': 'Leave blank to keep current password',
    'enterNewPasswordOptional': 'Enter new password (optional)',
    'createUser': 'Create User',
    'updateUser': 'Update User',
    
    // Field Fix
    'fieldFix': 'Field Fix',
    'createNewFieldFix': 'Create New Field Fix',
    'savedFieldFix': 'Saved Field Fix',
    'pendingForApproval': 'Pending for Approval',
    'returnedFieldFix': 'Returned Field Fix',
    'archivedFieldFix': 'Archived Field Fix',
    'releasedFieldFix': 'Released Field Fix',
    
    // Master Model
    'masterModel': 'Master Model',
    'configGroup': 'Config Group',
    'configValues': 'Config Values',
    'manageMasters': 'Manage Masters',
    'apiLogs': 'Api Logs',
    'dataMigration': 'Data Migration',
    'emailConfigurations': 'Email configurations',
    
    // Mapping
    'mapping': 'Mapping',
    'countryMapping': 'Country Mapping',
    'generalDistributors': 'General Distributors',
    
    // Other
    'helpManualUpload': 'Help Manual Upload',
    'fieldFixProgress': 'Field Fix Progress',
    'reportGallery': 'Report Gallery',
    'apiRegistry': 'API Registry',
    'manageRoles': 'Manage Roles',
    'deactivatedUsers': 'Deactivated Users',
    'newFieldFixFromCSHQ': 'New Field Fix From CSHQ',
    'onHoldFieldFix': 'On Hold Field Fix',
    'readyToRelease': 'Ready To Release',
    'releasedFieldFixToGD': 'Released Field Fix to GD',
    'fieldFixLimitedToRC': 'Field Fix Limited to RC',
    'newFieldFixFromQM': 'New Field Fix From QM',
    'fieldFixProgressUpdate': 'Field Fix Progress Update',
    'fieldFixProgressUpdateRC': 'Field Fix Progress Update - RC',
    'falconUpdates': 'Falcon Updates',
    'onHoldFieldFixProgress': 'On Hold Field Fix',
    'archivedFieldFixProgress': 'Archived Field Fix'
  },
  
  ja: {
    // Common
    'dashboard': 'ダッシュボード',
    'logout': 'ログアウト',
    'login': 'ログイン',
    'email': 'メール',
    'password': 'パスワード',
    'name': '名前',
    'role': '役割',
    'roles': '役割',
    'language': '言語',
    'status': 'ステータス',
    'actions': 'アクション',
    'active': 'アクティブ',
    'inactive': '非アクティブ',
    'edit': '編集',
    'delete': '削除',
    'cancel': 'キャンセル',
    'save': '保存',
    'submit': '送信',
    'create': '作成',
    'update': '更新',
    'add': '追加',
    'remove': '削除',
    'search': '検索',
    'filter': 'フィルター',
    'noData': 'データが見つかりません',
    'loading': '読み込み中...',
    'error': 'エラー',
    'success': '成功',
    'required': '必須',
    'optional': 'オプション',
    
    // User Management
    'addNewUser': '新しいユーザーを追加',
    'editUser': 'ユーザーを編集',
    'manageUsers': 'ユーザー管理',
    'userManagement': 'ユーザー管理',
    'mobile': '携帯電話',
    'address': '住所',
    'region': '地域',
    'iamShortId': 'IAMショートID',
    'ssoId': 'SSO ID',
    'activate': '有効化',
    'deactivate': '無効化',
    'changePassword': 'パスワードを変更',
    'newPassword': '新しいパスワード',
    'passwordRequired': 'パスワードは必須です',
    'passwordMinLength': 'パスワードは6文字以上である必要があります',
    'nameRequired': '名前は必須です',
    'emailRequired': 'メールは必須です',
    'roleRequired': '役割は必須です',
    'regionRequired': 'RCおよびGDユーザーには地域が必要です',
    'otherRoles': 'その他の役割（1つ選択）',
    'rcGdRoles': 'RC / GD役割（両方選択可能）',
    'optionalFields': 'オプションフィールド',
    'enterMobileNumber': '携帯電話番号を入力',
    'enterIamShortId': 'IAMショートIDを入力',
    'enterRegion': '地域を入力',
    'enterAddress': '住所を入力',
    'leaveBlankToKeepCurrent': '現在のパスワードを保持するには空白のままにします',
    'enterNewPasswordOptional': '新しいパスワードを入力（オプション）',
    'createUser': 'ユーザーを作成',
    'updateUser': 'ユーザーを更新',
    
    // Field Fix
    'fieldFix': 'フィールド修正',
    'createNewFieldFix': '新しいフィールド修正を作成',
    'savedFieldFix': '保存されたフィールド修正',
    'pendingForApproval': '承認待ち',
    'returnedFieldFix': '返却されたフィールド修正',
    'archivedFieldFix': 'アーカイブされたフィールド修正',
    'releasedFieldFix': 'リリースされたフィールド修正',
    
    // Master Model
    'masterModel': 'マスターモデル',
    'configGroup': '設定グループ',
    'configValues': '設定値',
    'manageMasters': 'マスター管理',
    'apiLogs': 'APIログ',
    'dataMigration': 'データ移行',
    'emailConfigurations': 'メール設定',
    
    // Mapping
    'mapping': 'マッピング',
    'countryMapping': '国マッピング',
    'generalDistributors': '一般販売店',
    
    // Other
    'helpManualUpload': 'ヘルプマニュアルアップロード',
    'fieldFixProgress': 'フィールド修正の進捗',
    'reportGallery': 'レポートギャラリー',
    'apiRegistry': 'APIレジストリ',
    'manageRoles': '役割管理',
    'deactivatedUsers': '無効化されたユーザー',
    'newFieldFixFromCSHQ': 'CSHQからの新しいフィールド修正',
    'onHoldFieldFix': '保留中のフィールド修正',
    'readyToRelease': 'リリース準備完了',
    'releasedFieldFixToGD': 'GDにリリースされたフィールド修正',
    'fieldFixLimitedToRC': 'RC限定フィールド修正',
    'newFieldFixFromQM': 'QMからの新しいフィールド修正',
    'fieldFixProgressUpdate': 'フィールド修正の進捗更新',
    'fieldFixProgressUpdateRC': 'フィールド修正の進捗更新 - RC',
    'falconUpdates': 'Falcon更新',
    'onHoldFieldFixProgress': '保留中のフィールド修正',
    'archivedFieldFixProgress': 'アーカイブされたフィールド修正'
  }
};

/**
 * Get translation for a key based on language
 * @param {string} key - Translation key
 * @param {string} lang - Language code ('en' or 'ja')
 * @returns {string} - Translated string or key if not found
 */
export const t = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};

/**
 * Get all translations for a language
 * @param {string} lang - Language code
 * @returns {object} - Translation object
 */
export const getTranslations = (lang = 'en') => {
  return translations[lang] || translations['en'];
};

export default translations;

