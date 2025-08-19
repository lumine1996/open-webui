import { browser, dev } from '$app/environment';
// import { version } from '../../package.json';

export const APP_NAME = import.meta.env.VITE_APP_NAME;
export const APP_COMPANY_NAME = import.meta.env.VITE_APP_COMPANY_NAME;
export const APP_PARTNERSHIP_NAME = import.meta.env.VITE_APP_PARTNERSHIP_NAME;

export const COMPANY_SLOGAN_PRIMARY = import.meta.env.VITE_COMPANY_SLOGAN_PRIMARY;
export const COMPANY_SLOGAN_SECONDARY = import.meta.env.VITE_COMPANY_SLOGAN_SECONDARY;
export const COMPANY_EMAIL_SUFFIX = import.meta.env.VITE_COMPANY_EMAIL_SUFFIX;
export const VITE_AI_CHAT_SERVER_BASE_API = import.meta.env.VITE_AI_CHAT_SERVER_BASE_API;
export const VITE_ACCOUNT_CENTER_BASE_API = dev ?  import.meta.env.VITE_ACCOUNT_CENTER_BASE_API_DEV : import.meta.env.VITE_ACCOUNT_CENTER_BASE_API;

// 可以分别指定 dev 和 build 使用的 WebUI 地址，本地也可以使用服务器上的后端
export const WEBUI_SERVER_HOSTNAME = dev ? import.meta.env.VITE_WEBUI_SERVER_HOSTNAME_DEV : import.meta.env.VITE_WEBUI_SERVER_HOSTNAME;
export const WEBUI_HOSTNAME = browser ? `${WEBUI_SERVER_HOSTNAME}` : '';
export const WEBUI_BASE_URL = browser ? `http://${WEBUI_HOSTNAME}` : ``;
export const WEBUI_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1`;
export const AI_CHAT_SERVER_BASE_API = `${VITE_AI_CHAT_SERVER_BASE_API}/api/v2`;
export const ACCOUNT_CENTER_BASE_API = import.meta.env.VITE_ACCOUNT_CENTER_BASE_API;
// 丽蟾云登录地址 
export const LICHEN_CLOUD_LOGIN_URL = `${VITE_AI_CHAT_SERVER_BASE_API}/account/login`;
export const OLLAMA_API_BASE_URL = `${WEBUI_BASE_URL}/ollama`;
export const OPENAI_API_BASE_URL = `${WEBUI_BASE_URL}/openai`;
export const AUDIO_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1/audio`;
export const IMAGES_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1/images`;
export const RETRIEVAL_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1/retrieval`;

export const WEBUI_VERSION = APP_VERSION;
export const WEBUI_BUILD_HASH = APP_BUILD_HASH;
export const REQUIRED_OLLAMA_VERSION = '0.1.16';

export const SHOW_FLOAT_BUTTON = false;

export const SUPPORTED_FILE_TYPE = [
	'application/epub+zip',
	'application/pdf',
	'text/plain',
	'text/csv',
	'text/xml',
	'text/html',
	'text/x-python',
	'text/css',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/octet-stream',
	'application/x-javascript',
	'text/markdown',
	'audio/mpeg',
	'audio/wav',
	'audio/ogg',
	'audio/x-m4a'
];

export const SUPPORTED_FILE_EXTENSIONS = [
	'md',
	'rst',
	'go',
	'py',
	'java',
	'sh',
	'bat',
	'ps1',
	'cmd',
	'js',
	'ts',
	'css',
	'cpp',
	'hpp',
	'h',
	'c',
	'cs',
	'htm',
	'html',
	'sql',
	'log',
	'ini',
	'pl',
	'pm',
	'r',
	'dart',
	'dockerfile',
	'env',
	'php',
	'hs',
	'hsc',
	'lua',
	'nginxconf',
	'conf',
	'm',
	'mm',
	'plsql',
	'perl',
	'rb',
	'rs',
	'db2',
	'scala',
	'bash',
	'swift',
	'vue',
	'svelte',
	'doc',
	'docx',
	'pdf',
	'csv',
	'txt',
	'xls',
	'xlsx',
	'pptx',
	'ppt',
	'msg'
];

export const PASTED_TEXT_CHARACTER_LIMIT = 1000;

// Source: https://kit.svelte.dev/docs/modules#$env-static-public
// This feature, akin to $env/static/private, exclusively incorporates environment variables
// that are prefixed with config.kit.import.meta.env.VITE_publicPrefix (usually set to PUBLIC_).
// Consequently, these variables can be securely exposed to client-side code.
