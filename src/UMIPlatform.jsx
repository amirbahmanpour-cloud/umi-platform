import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Target, LogOut, User, Eye, EyeOff, History, Edit, Upload, Download, Play, Plus, X, Trash2, Shield, Users, TrendingUp, BarChart3, MapPin, Calendar, Filter, Search, Check, Zap, DollarSign, Activity, Building2, Box, Save, AlertCircle, Navigation, Route, Clock, AlertTriangle, Globe, Menu, Image, ArrowLeft, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend, ScatterChart, Scatter } from 'recharts';

// ═══════════════════════════════════════════════════════════════════════════
// i18n — BILINGUAL SYSTEM (Persian / English)
// ═══════════════════════════════════════════════════════════════════════════
const I18N = {
  fa: {
    _dir: 'rtl', _lang: 'fa',
    appName: 'هوش رسانه‌ای شهری', appShort: 'UMI',
    signIn: 'ورود', signInToContinue: 'برای ادامه وارد شوید', signingIn: 'در حال ورود...',
    username: 'نام کاربری', password: 'رمز عبور', enterUsername: 'نام کاربری را وارد کنید', enterPassword: 'رمز عبور را وارد کنید',
    invalidCreds: 'نام کاربری یا رمز عبور اشتباه است', demoAccounts: 'حساب‌های نمونه:',
    admin: 'مدیر', manager: 'مدیر میانی', viewer: 'بازدیدکننده', logout: 'خروج',
    // tabs
    map: 'نقشه', navigation: 'مسیریابی', analytics3d: 'تحلیل ۳بعدی', budget: 'بودجه',
    analytics: 'تحلیل', history: 'تاریخچه', users: 'کاربران', about: 'درباره',
    // stats
    selected: 'انتخاب‌شده', reach: 'دسترسی', cost: 'هزینه', assets: 'تابلوها',
    available: 'آزاد', booked: 'رزرو', cities: 'شهرها',
    // map
    interactiveMap: 'نقشه تعاملی', allTypes: 'همه انواع', allStatus: 'همه وضعیت‌ها', allCities: 'همه شهرها',
    visibilityRadius: 'برد دید',
    facingDir: 'جهت تابلو',
    towards: 'به سمت',
    billboardAssets: 'تابلوهای تبلیغاتی', addAsset: 'افزودن تابلو', syncSheet: 'همگام‌سازی شیت',
    export: 'خروجی', import: 'ورودی', traffic: 'ترافیک', price: 'قیمت', current: 'فعلی',
    // navigation
    routeVisibility: 'تحلیل دید مسیر', findBillboards: 'یافتن تابلوهای قابل‌دید در مسیر',
    origin: 'مبدأ', destination: 'مقصد', searchAddress: 'جستجوی آدرس یا انتخاب روی نقشه...',
    detectionRadius: 'شعاع تشخیص', searchRadius: 'حداکثر فاصله جستجو', avgSpeed: 'سرعت میانگین', reset: 'بازنشانی', recalculate: 'محاسبه مجدد',
    clickMapSet: 'روی نقشه کلیک کنید تا', setAsOrigin: 'مبدأ (A)', setAsDest: 'مقصد (B)', tessSet: 'تنظیم شود',
    distance: 'مسافت', duration: 'مدت', visibleBillboards: 'تابلوهای قابل‌دید', totalExposure: 'مواجهه کل',
    billboardsAlongRoute: 'تابلوهای مسیر', atKm: 'در کیلومتر', viewTime: 'زمان دید', lanes: 'لاین‌ها',
    startRoute: 'تحلیل مسیر را شروع کنید', calculatingRoute: 'محاسبه مسیر...',
    // 3d
    perf3d: 'داشبورد عملکرد ۳بعدی', barHeightScore: 'ارتفاع میله = امتیاز · رنگ = درجه · کلیک برای انتخاب',
    avgScore: 'امتیاز میانگین', withIssues: 'دارای مشکل', critical: 'بحرانی',
    topPerformers: 'برترین‌ها', needAttention: 'نیازمند توجه', scoreBreakdown: 'تفکیک امتیاز — همه تابلوها',
    grade: 'درجه', total: 'کل', physical: 'فیزیکی', visibility: 'دید', value: 'ارزش', issues: 'مشکلات',
    heightAxis: 'محور ارتفاع', colorBy: 'رنگ بر اساس', city: 'شهر', type: 'نوع',
    // budget
    budgetOptimizer: 'بهینه‌ساز بودجه', select: 'انتخاب', compare: 'مقایسه', budgetMillion: 'بودجه (میلیون تومان)',
    usage: 'مصرف', autoOptimize: 'بهینه‌سازی خودکار', impMonth: 'بازدید/ماه', totalCost: 'هزینه کل', avgCpm: 'CPM میانگین',
    availableManual: 'تابلوهای آزاد — انتخاب دستی', filterByCity: 'فیلتر شهر', filterByType: 'فیلتر نوع', sortBy: 'مرتب‌سازی',
    assetsShown: 'تابلو نمایش داده‌شده', clearAll: 'پاک کردن همه', selectedBillboards: 'تابلوهای انتخابی',
    budgetTargetCity: 'شهر مقصد بودجه', weeks: 'هفته', budgetCap: 'سقف بودجه', inBudget: 'در بودجه؟',
    yes: 'بله', no: 'خیر', cityBudgetBreakdown: 'تفکیک بودجه شهر به شهر',
    // optimization strategies
    autoOptimization: 'بهینه‌سازی خودکار', maxQuantity: 'حداکثر تعداد', maxQuantityD: 'ارزان‌ترین‌ها، بیشترین تعداد',
    maxViews: 'حداکثر بازدید', maxViewsD: 'بهترین CPM، بیشترین بازدید', bestCoverage: 'بهترین پوشش', bestCoverageD: 'توزیع بین شهرها',
    balancedTypes: 'انواع متوازن', balancedTypesD: 'ترکیب همه انواع', customMixed: 'استراتژی ترکیبی', customMixedD: 'ترکیب عوامل با وزن دلخواه',
    adjustWeights: 'تنظیم وزن‌ها (مجموع ۱۰۰٪)', quantity: 'تعداد', views: 'بازدید', coverage: 'پوشش',
    runOptimization: 'اجرای بهینه‌سازی', optimizing: 'در حال بهینه‌سازی...', cancel: 'انصراف',
    // analytics
    totalAssets: 'کل تابلوها', cityPerformance: 'عملکرد شهرها', typeDistribution: 'توزیع انواع',
    impVsCpm: 'بازدید در برابر CPM', bySize: 'بر اساس اندازه', lighting: 'نورپردازی', direction: 'جهت',
    completeData: 'داده کامل تابلوها', avgTraffic: 'ترافیک میانگین', avgPrice: 'قیمت میانگین',
    exportFiltered: 'خروجی فیلترشده', filterResults: 'نتایج فیلتر', minImpressions: 'حداقل بازدید',
    noLimit: 'بدون محدودیت', campaign: 'کمپین', allCampaigns: 'همه کمپین‌ها',
    // history
    screeningHistory: 'تاریخچه اکران', records: 'رکوردها', brand: 'برند', asset: 'تابلو', dateFrom: 'از تاریخ', dateTo: 'تا تاریخ',
    searchAsset: 'جستجوی تابلو', searchAssetName: 'نام تابلو را جستجو کنید...', clearFilters: 'پاک کردن فیلترها',
    noRecords: 'رکوردی یافت نشد', tryAdjust: 'فیلترها را تغییر دهید', completed: 'تمام‌شده', active: 'فعال',
    brandAnalysis: 'تحلیل کمپین برند', campaigns: 'کمپین‌ها', totalCampaigns: 'کل کمپین‌ها', activeCampaigns: 'کمپین‌های فعال', uniqueBrands: 'برندهای یکتا',
    duration2: 'مدت', status: 'وضعیت', ongoing: 'در حال اجرا',
    // users
    userManagement: 'مدیریت کاربران', addUser: 'افزودن کاربر', editUser: 'ویرایش کاربر', role: 'نقش',
    permissions: 'دسترسی‌ها', permissionGuide: 'راهنمای دسترسی', fullName: 'نام کامل',
    update: 'به‌روزرسانی', create: 'ایجاد', cannotDeleteSelf: 'نمی‌توانید حساب خود را حذف کنید',
    // asset modal
    editAsset: 'ویرایش تابلو', addNewAsset: 'افزودن تابلوی جدید', assetName: 'نام تابلو', size: 'اندازه',
    height: 'ارتفاع', width: 'عرض', structureHeight: 'ارتفاع سازه', dailyTraffic: 'ترافیک روزانه', monthlyPrice: 'قیمت ماهانه', agency: 'آژانس',
    hasLight: 'نورپردازی', latitude: 'عرض جغرافیایی', longitude: 'طول جغرافیایی', currentBrand: 'برند فعلی',
    streetVisibility: 'خیابان و دید', numberOfLanes: 'تعداد لاین', visibleFromLanes: 'قابل‌دید از لاین‌ها',
    hasObstacle: 'مانع فیزیکی', obstacleCoverage: 'پوشش مانع', obstacleRemovable: 'قابل‌حذف', obstacleAffects: 'مانع روی لاین‌ها',
    saveChanges: 'ذخیره تغییرات', createAsset: 'ایجاد تابلو', avgViewSec: 'زمان دید میانگین (ثانیه)', avgSpeedField: 'سرعت میانگین (km/h)',
    // generic
    small: 'کوچک', medium: 'متوسط', large: 'بزرگ', xlarge: 'فوق‌بزرگ',
    inbound: 'ورودی', outbound: 'خروجی', north: 'شمال', south: 'جنوب', east: 'شرق', west: 'غرب',
    none: 'هیچ', tree: 'درخت', trafficSign: 'تابلو راهنمایی', direct: 'مستقیم', angled: 'زاویه‌دار',
    manage: 'مدیریت', imageManager: 'مدیریت تصاویر', uploadImages: 'بارگذاری تصاویر',
    selectImages: 'انتخاب تصاویر', noImages: 'هنوز تصویری نیست', generalGallery: 'گالری عمومی', campaignImages: 'تصاویر کمپین',
    syncImages: 'همگام‌سازی تصاویر از گوگل‌شیت', sheetUrl: 'آدرس گوگل‌شیت', syncNow: 'همگام‌سازی', syncComplete: 'همگام‌سازی کامل شد', notes: 'یادداشت',
    importExport: 'ورودی / خروجی', exportJson: 'خروجی JSON', importJson: 'ورودی فایل JSON', deleteAsset2: 'حذف تابلو؟', deleteConfirm: 'آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.',
    delete: 'حذف', addCampaign: 'افزودن کمپین', brandName: 'نام برند', startDate: 'تاریخ شروع', endDate: 'تاریخ پایان', endDateEmpty: 'خالی = در حال اجرا',
    permView: 'مشاهده تابلوها', permViewD: 'مشاهده داده و نقشه', permAdd: 'افزودن تابلو', permAddD: 'افزودن تابلوی جدید',
    permEdit: 'ویرایش تابلو', permEditD: 'تغییر تابلوهای موجود', permDelete: 'حذف تابلو', permDeleteD: 'حذف تابلوها',
    permOptimize: 'بهینه‌سازی بودجه', permOptimizeD: 'استفاده از ابزار بهینه‌سازی', permUsers: 'مدیریت کاربران', permUsersD: 'افزودن/ویرایش/حذف کاربر',
    permIE: 'ورودی/خروجی', permIED: 'وارد و صادر کردن داده',
    obstacle: 'مانع', affectsLanes: 'روی لاین‌های', removable: 'قابل‌حذف', permanent: 'دائمی',
    monthlyImp: 'بازدید ماهانه', score: 'امتیاز', light: 'نور', lit: 'روشن', dark: 'تاریک',
    // about
    aboutHero1: 'رسانه محیطی،', aboutHero2: 'بازتعریف‌شده.',
    gallery: 'گالری', galleryDesc: 'گالری تصاویر کمپین‌ها و تابلوها',
    filters: 'فیلترها', activeFilters: 'فیلتر فعال', noResults: 'نتیجه‌ای یافت نشد',
    filterByCampaignDate: 'تاریخ اکران',
    allBrands: 'همه برندها', filterByBrand: 'فیلتر برند',
    noBrandImages: 'هیچ کمپینی تصویر ندارد', images: 'تصویر',
    backToBrands: 'بازگشت به برندها', backToAssets: 'بازگشت به تابلوها',
    viewGallery: 'مشاهده گالری',
    aboutSub: 'یک لایه‌ی هوشمند کامل برای بیلبوردها، بنرها و سیتی‌لایت‌ها — تبدیل موجودی پراکنده به یک سطح واحد، قابل‌اندازه‌گیری و بهینه‌سازی.',
    exploreMap: 'کاوش نقشه', tryRoute: 'امتحان تحلیل مسیر', getStarted: 'شروع کنید',
  },
  en: {
    _dir: 'ltr', _lang: 'en',
    appName: 'Urban Media Intelligence', appShort: 'UMI',
    signIn: 'Sign In', signInToContinue: 'Sign in to continue', signingIn: 'Signing in...',
    username: 'Username', password: 'Password', enterUsername: 'Enter username', enterPassword: 'Enter password',
    invalidCreds: 'Invalid username or password', demoAccounts: 'Demo Accounts:',
    admin: 'Admin', manager: 'Manager', viewer: 'Viewer', logout: 'Logout',
    map: 'Map', navigation: 'Navigation', analytics3d: '3D Analytics', budget: 'Budget',
    analytics: 'Analytics', history: 'History', users: 'Users', about: 'About',
    selected: 'Selected', reach: 'Reach', cost: 'Cost', assets: 'Assets',
    available: 'Available', booked: 'Booked', cities: 'Cities',
    interactiveMap: 'Interactive Map', allTypes: 'All Types', allStatus: 'All Status', allCities: 'All Cities',
    billboard: 'Billboard', banner: 'Banner', citylight: 'Citylight', show: 'Show',
    visibilityRadius: 'Sight Distance',
    facingDir: 'Facing',
    towards: 'towards',
    billboardAssets: 'Billboard Assets', addAsset: 'Add Asset', syncSheet: 'Sync Sheet',
    export: 'Export', import: 'Import', traffic: 'Traffic', price: 'Price', current: 'Current',
    routeVisibility: 'Route Visibility Analysis', findBillboards: 'Find billboards visible along any route',
    origin: 'Origin', destination: 'Destination', searchAddress: 'Search address or pick on map...',
    detectionRadius: 'Detection Radius', searchRadius: 'Max Search Distance', avgSpeed: 'Avg Speed', reset: 'Reset', recalculate: 'Recalculate',
    clickMapSet: 'Click anywhere on the map to set the', setAsOrigin: 'origin (A)', setAsDest: 'destination (B)', tessSet: '',
    distance: 'Distance', duration: 'Duration', visibleBillboards: 'Visible Billboards', totalExposure: 'Total Exposure',
    billboardsAlongRoute: 'Billboards Along Route', atKm: 'At KM', viewTime: 'View Time', lanes: 'Lanes',
    startRoute: 'Start Your Route Analysis', calculatingRoute: 'Calculating route...',
    perf3d: '3D Performance Dashboard', barHeightScore: 'Bar height = score · Color = grade · Click to select',
    avgScore: 'Avg Score', withIssues: 'With Issues', critical: 'Critical',
    topPerformers: 'Top Performers', needAttention: 'Need Attention', scoreBreakdown: 'Score Breakdown — All Assets',
    grade: 'Grade', total: 'Total', physical: 'Physical', visibility: 'Visibility', value: 'Value', issues: 'Issues',
    heightAxis: 'Height Axis', colorBy: 'Color By', city: 'City', type: 'Type',
    budgetOptimizer: 'Budget Optimizer', select: 'Select', compare: 'Compare', budgetMillion: 'Budget (Million IRR)',
    usage: 'Usage', autoOptimize: 'Auto Optimize', impMonth: 'Imp/Month', totalCost: 'Total Cost', avgCpm: 'Avg CPM',
    availableManual: 'Available Assets — Manual Selection', filterByCity: 'Filter by City', filterByType: 'Filter by Type', sortBy: 'Sort By',
    assetsShown: 'assets shown', clearAll: 'Clear All', selectedBillboards: 'Selected Billboards',
    budgetTargetCity: 'Budget Target City', weeks: 'weeks', budgetCap: 'Budget Cap', inBudget: 'In Budget?',
    yes: 'Yes', no: 'No', cityBudgetBreakdown: 'City-by-City Budget Breakdown',
    autoOptimization: 'Auto Optimization', maxQuantity: 'Maximum Quantity', maxQuantityD: 'Cheapest, maximize count',
    maxViews: 'Maximum Views', maxViewsD: 'Best CPM, highest impressions', bestCoverage: 'Best Coverage', bestCoverageD: 'Distribute across cities',
    balancedTypes: 'Balanced Types', balancedTypesD: 'Mix of all types', customMixed: 'Custom Mixed Strategy', customMixedD: 'Combine factors with weights',
    adjustWeights: 'Adjust Weights (Total 100%)', quantity: 'Quantity', views: 'Views', coverage: 'Coverage',
    runOptimization: 'Run Optimization', optimizing: 'Optimizing...', cancel: 'Cancel',
    totalAssets: 'Total Assets', cityPerformance: 'City Performance', typeDistribution: 'Type Distribution',
    impVsCpm: 'Impressions vs CPM', bySize: 'By Size', lighting: 'Lighting', direction: 'Direction',
    completeData: 'Complete Asset Data', avgTraffic: 'Avg Traffic', avgPrice: 'Avg Price',
    exportFiltered: 'Export Filtered', filterResults: 'Filter Results', minImpressions: 'Min Impressions',
    noLimit: 'No Limit', campaign: 'Campaign', allCampaigns: 'All Campaigns',
    screeningHistory: 'Screening History', records: 'Records', brand: 'Brand', asset: 'Asset', dateFrom: 'Date From', dateTo: 'Date To',
    searchAsset: 'Search Asset', searchAssetName: 'Search asset name...', clearFilters: 'Clear All Filters',
    noRecords: 'No records found', tryAdjust: 'Try adjusting filters', completed: 'Completed', active: 'Active',
    brandAnalysis: 'Brand Campaign Analysis', campaigns: 'campaigns', totalCampaigns: 'Total Campaigns', activeCampaigns: 'Active Campaigns', uniqueBrands: 'Unique Brands',
    duration2: 'Duration', status: 'Status', ongoing: 'Ongoing',
    userManagement: 'User Management', addUser: 'Add User', editUser: 'Edit User', role: 'Role',
    permissions: 'Permissions', permissionGuide: 'Permission Guide', fullName: 'Full Name',
    update: 'Update', create: 'Create', cannotDeleteSelf: 'Cannot delete your own account',
    editAsset: 'Edit Asset', addNewAsset: 'Add New Asset', assetName: 'Asset Name', size: 'Size',
    height: 'Height', width: 'Width', structureHeight: 'Structure Height', dailyTraffic: 'Daily Traffic', monthlyPrice: 'Monthly Price', agency: 'Agency',
    hasLight: 'Has Light', latitude: 'Latitude', longitude: 'Longitude', currentBrand: 'Current Brand',
    streetVisibility: 'Street & Visibility', numberOfLanes: 'Number of Lanes', visibleFromLanes: 'Visible From Lanes',
    hasObstacle: 'Has Physical Obstacle', obstacleCoverage: 'Obstacle Coverage', obstacleRemovable: 'Obstacle Removable', obstacleAffects: 'Obstacle Affects Lanes',
    saveChanges: 'Save Changes', createAsset: 'Create Asset', avgViewSec: 'Avg View Time (sec)', avgSpeedField: 'Avg Speed (km/h)',
    small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'XLarge',
    inbound: 'Inbound', outbound: 'Outbound', north: 'North', south: 'South', east: 'East', west: 'West',
    none: 'None', tree: 'Tree', trafficSign: 'Traffic Sign', direct: 'Direct', angled: 'Angled',
    manage: 'Manage', imageManager: 'Image Manager', uploadImages: 'Upload Images',
    selectImages: 'Select Images', noImages: 'No images yet', generalGallery: 'General Gallery', campaignImages: 'Campaign Images',
    syncImages: 'Sync Images from Google Sheets', sheetUrl: 'Google Sheets URL', syncNow: 'Sync Now', syncComplete: 'Sync Complete', notes: 'Notes',
    importExport: 'Import / Export', exportJson: 'Export to JSON', importJson: 'Import JSON File', deleteAsset2: 'Delete Asset?', deleteConfirm: 'Are you sure? This cannot be undone.',
    delete: 'Delete', addCampaign: 'Add Campaign', brandName: 'Brand Name', startDate: 'Start Date', endDate: 'End Date', endDateEmpty: 'empty = ongoing',
    permView: 'View Assets', permViewD: 'View billboard data and maps', permAdd: 'Add Assets', permAddD: 'Add new billboards',
    permEdit: 'Edit Assets', permEditD: 'Modify existing billboards', permDelete: 'Delete Assets', permDeleteD: 'Remove billboards',
    permOptimize: 'Budget Optimization', permOptimizeD: 'Use budget optimization tools', permUsers: 'Manage Users', permUsersD: 'Add/edit/delete users',
    permIE: 'Import/Export', permIED: 'Import and export data',
    obstacle: 'Obstacle', affectsLanes: 'affects lanes', removable: 'Removable', permanent: 'permanent',
    monthlyImp: 'Monthly Imp', score: 'Score', light: 'Light', lit: 'Lit', dark: 'Dark',
    aboutHero1: 'Out-of-Home Media,', aboutHero2: 'Reimagined.',
    gallery: 'Gallery', galleryDesc: 'Campaign and asset image gallery',
    filters: 'Filters', activeFilters: 'active', noResults: 'No results found',
    filterByCampaignDate: 'Campaign Date',
    allBrands: 'All Brands', filterByBrand: 'Filter by Brand',
    noBrandImages: 'No brand has images', images: 'images',
    backToBrands: 'Back to Brands', backToAssets: 'Back to Assets',
    viewGallery: 'View Gallery',
    aboutSub: 'A complete intelligence layer for billboards, banners, and citylights — turning fragmented inventory into a single, measurable, optimizable surface.',
    exploreMap: 'Explore the Map', tryRoute: 'Try Route Analysis', getStarted: 'Get Started',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════
const CITY_COORDS = {
  Tehran: { lat: 35.6892, lng: 51.389, fa: 'تهران' },
  Mashhad: { lat: 36.297, lng: 59.6062, fa: 'مشهد' },
  Isfahan: { lat: 32.6546, lng: 51.6679, fa: 'اصفهان' },
  Shiraz: { lat: 29.5918, lng: 52.5837, fa: 'شیراز' },
  Tabriz: { lat: 38.0962, lng: 46.2738, fa: 'تبریز' },
};
const CITY_LIST = Object.keys(CITY_COORDS);
const STREETS = {
  Tehran: ['Valiasr','Azadi','Beheshti','Modarres','Chamran','Sattarkhan','Enghelab','Tohid','Saadi','Amirabad','Shariati','Jordan','Fereshteh','Elahieh','Niavaran','Damavand','Resalat','Hemmat','Shahran','Ekbatan'],
  Mashhad: ['Imam Reza','Shariati','Rahnamaei','Farrokhi','Ahmadabad','Daneshgah','Tabarsi','Hashemieh','Vakilabad','Pirouzi','Kohsangi','Sanabad','Sayyad','Falahi','Eghbal','Mosalla','Ghasemabad','Khosravi','Shahed','Janbaz'],
  Isfahan: ['Chaharbagh','Amadegah','Ahmadabad','Ferdowsi','Modarres','Valiasr','Bozorgmehr','Ibn Sina','Sofeh','Hasht Behesht','Sheikh Sadough','Goldasteh','Nazar','Mohtasham','Naghsh Jahan','Barazandeh','Tohid','Ahmadi','Imam Ali','Kaveh'],
  Shiraz: ['Zand','Mollasadra','Maaliabad','Ghasrodasht','Farhang','Rajaei','Daneshjoo','Edalat','Sattarkhan','Modarres','Afifabad','Lotfalikhan','Mirzaye','Eram','Maali','Saadi','Hafez','Loghman','Neshat','Pasdaran'],
  Tabriz: ['Artesh','Azarbaijan','Shariati','Azadi','Madani','Baghmisheh','Valiasr','Tarbiat','Elgoli','Daneshgah','Abresan','Roshdieh','Pasteur','Monajem','Felestin','Khaghani','Abureyhan','Seh Rah','Gharamalek','Bilankouh'],
};
const STREETS_FA = {
  Tehran: ['ولیعصر','آزادی','بهشتی','مدرس','چمران','ستارخان','انقلاب','توحید','سعدی','امیرآباد','شریعتی','جردن','فرشته','الهیه','نیاوران','دماوند','رسالت','همت','شهران','اکباتان'],
  Mashhad: ['امام رضا','شریعتی','راهنمایی','فرخی','احمدآباد','دانشگاه','طبرسی','هاشمیه','وکیل‌آباد','پیروزی','کوهسنگی','سناباد','صیاد','فلاحی','اقبال','مصلی','قاسم‌آباد','خسروی','شاهد','جانباز'],
  Isfahan: ['چهارباغ','آمادگاه','احمدآباد','فردوسی','مدرس','ولیعصر','بزرگمهر','ابن‌سینا','صفه','هشت‌بهشت','شیخ‌صدوق','گلدسته','نظر','محتشم','نقش‌جهان','برازنده','توحید','احمدی','امام‌علی','کاوه'],
  Shiraz: ['زند','ملاصدرا','معالی‌آباد','قصرالدشت','فرهنگ','رجایی','دانشجو','عدالت','ستارخان','مدرس','عفیف‌آباد','لطفعلی‌خان','میرزای','ارم','معالی','سعدی','حافظ','لقمان','نشاط','پاسداران'],
  Tabriz: ['ارتش','آذربایجان','شریعتی','آزادی','مدنی','باغمیشه','ولیعصر','تربیت','ائل‌گلی','دانشگاه','آبرسان','رشدیه','پاستور','منجم','فلسطین','خاقانی','ابوریحان','سه‌راه','قراملک','بیلانکوه'],
};
const AGENCIES = ['Tehran Media','Mashhad Ads','Pouya Media','IranBoard','Pars Media'];
const CAMPAIGN_BRANDS = ['Samsung','Apple','Coca-Cola','Nike','Adidas','Sony','LG','Pepsi','Digikala','Snapp','Irancell','Bank Mellat'];
const SIZES = ['Small','Medium','Large','XLarge'];
const TYPES_EN = ['Billboard','Banner','Citylight'];

// Original 6 hand-crafted assets (preserved)
const DEFAULT_ASSETS = [
  { id: 1, name: 'Valiasr Billboard', nameFa: 'بیلبورد ولیعصر', lat: 35.7575, lng: 51.4180, type: 'Billboard', size: 'Large', height: 12, traffic: 95000, price: 45000000, status: 'available', agency: 'Tehran Media', brand: '', city: 'Tehran', obstruction: 'None', direction: 'Inbound', boardAngle: 'Direct', geoDirection: 'North', hasLight: 'Yes', avgSpeed: 50, avgViewTime: 4.2, detectionRadius: 180, brandHistory: [{ brand: 'Samsung', date: '2026-01-15', endDate: '2026-03-15' },{ brand: 'Apple', date: '2026-04-01', endDate: '2026-06-01' }] },
  { id: 2, name: 'Azadi Banner', nameFa: 'بنر آزادی', lat: 35.6997, lng: 51.3381, type: 'Banner', size: 'XLarge', height: 8, traffic: 120000, price: 65000000, status: 'available', agency: 'Azadi Ads', brand: '', city: 'Tehran', obstruction: 'Tree', direction: 'Outbound', boardAngle: 'Direct', geoDirection: 'West', hasLight: 'Yes', avgSpeed: 65, avgViewTime: 3.1, detectionRadius: 220, brandHistory: [{ brand: 'Coca-Cola', date: '2026-02-10', endDate: '2026-04-10' }] },
  { id: 3, name: 'Tajrish Light', nameFa: 'سیتی‌لایت تجریش', lat: 35.8042, lng: 51.4342, type: 'Citylight', size: 'Medium', height: 3, traffic: 75000, price: 25000000, status: 'booked', agency: 'Tehran Media', brand: 'Nike', city: 'Tehran', obstruction: 'Traffic Sign', direction: 'Inbound', boardAngle: 'Angled', geoDirection: 'East', hasLight: 'No', avgSpeed: 35, avgViewTime: 5.0, detectionRadius: 120, brandHistory: [{ brand: 'Adidas', date: '2026-01-05', endDate: '2026-03-05' },{ brand: 'Nike', date: '2026-05-01', endDate: null }] },
  { id: 4, name: 'Shiraz Gateway', nameFa: 'دروازه شیراز', lat: 29.5918, lng: 52.5836, type: 'Billboard', size: 'Large', height: 10, traffic: 80000, price: 35000000, status: 'available', agency: 'Shiraz Media', brand: '', city: 'Shiraz', obstruction: 'None', direction: 'Inbound', boardAngle: 'Direct', geoDirection: 'South', hasLight: 'Yes', avgSpeed: 55, avgViewTime: 3.8, detectionRadius: 200, brandHistory: [{ brand: 'Pepsi', date: '2026-03-01', endDate: '2026-05-01' }] },
  { id: 5, name: 'Isfahan Square', nameFa: 'میدان اصفهان', lat: 32.6546, lng: 51.6680, type: 'Banner', size: 'XLarge', height: 9, traffic: 110000, price: 55000000, status: 'available', agency: 'Isfahan Ads', brand: '', city: 'Isfahan', obstruction: 'None', direction: 'Outbound', boardAngle: 'Direct', geoDirection: 'North', hasLight: 'Yes', avgSpeed: 45, avgViewTime: 4.5, detectionRadius: 190, brandHistory: [{ brand: 'Sony', date: '2026-02-15', endDate: '2026-04-15' }] },
  { id: 6, name: 'Mashhad Boulevard', nameFa: 'بلوار مشهد', lat: 36.2974, lng: 59.6062, type: 'Citylight', size: 'Medium', height: 4, traffic: 90000, price: 30000000, status: 'available', agency: 'Mashhad Media', brand: '', city: 'Mashhad', obstruction: 'None', direction: 'Inbound', boardAngle: 'Direct', geoDirection: 'East', hasLight: 'Yes', avgSpeed: 50, avgViewTime: 4.0, detectionRadius: 160, brandHistory: [{ brand: 'LG', date: '2026-03-10', endDate: '2026-05-10' }] },
];

// Generate 20 random assets per city (100 total) — appended to the 6 defaults
function generateRandomAssets() {
  const out = [];
  let id = 7;
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  CITY_LIST.forEach((city) => {
    const coord = CITY_COORDS[city];
    for (let i = 0; i < 20; i++) {
      const type = pick(TYPES_EN);
      const size = pick(SIZES);
      const hasBrand = Math.random() > 0.45;
      const brandHistory = [];
      const nCampaigns = rnd(0, 3);
      for (let c = 0; c < nCampaigns; c++) {
        const sm = rnd(1, 9), sd = rnd(1, 28);
        const ongoing = c === nCampaigns - 1 && Math.random() > 0.5;
        brandHistory.push({
          brand: pick(CAMPAIGN_BRANDS),
          date: `140${rnd(4, 5)}-0${sm}-${String(sd).padStart(2, '0')}`,
          endDate: ongoing ? null : `140${rnd(4, 5)}-0${rnd(1, 9)}-${String(rnd(1, 28)).padStart(2, '0')}`,
        });
      }
      const curBrand = brandHistory.find(h => !h.endDate);
      out.push({
        id: id++,
        name: `${STREETS[city][i]} ${type}`,
        nameFa: `${type === 'Billboard' ? 'بیلبورد' : type === 'Banner' ? 'بنر' : 'سیتی‌لایت'} ${STREETS_FA[city][i]}`,
        lat: coord.lat + (Math.random() - 0.5) * 0.09,
        lng: coord.lng + (Math.random() - 0.5) * 0.09,
        type, size,
        height: rnd(3, 16),
        traffic: rnd(20000, 130000),
        price: rnd(12000000, 70000000),
        status: curBrand ? 'booked' : (Math.random() > 0.3 ? 'available' : 'booked'),
        agency: pick(AGENCIES),
        brand: curBrand ? curBrand.brand : '',
        city,
        obstruction: pick(['None','None','None','Tree','Traffic Sign']),
        direction: pick(['Inbound','Outbound']),
        boardAngle: pick(['Direct','Direct','Angled']),
        geoDirection: pick(['North','South','East','West']),
        hasLight: Math.random() > 0.35 ? 'Yes' : 'No',
        avgSpeed: rnd(20, 110),
        avgViewTime: parseFloat((Math.random() * 5 + 0.8).toFixed(1)),
        detectionRadius: rnd(80, 400),
        brandHistory,
      });
    }
  });
  return out;
}

const ALL_DEFAULT_ASSETS = [...DEFAULT_ASSETS, ...generateRandomAssets()];

// ═══════════════════════════════════════════════════════════════════════════
// SCORING
// ═══════════════════════════════════════════════════════════════════════════
const calcScore = (m) => {
  const s = { Small: 20, Medium: 40, Large: 70, XLarge: 90 }[m.size] || 30;
  const h = Math.min((m.height / 15) * 30, 30);
  const t = Math.min((m.traffic / 120000) * 25, 25);
  return Math.round(s + h + 25 + t);
};
const calcImp = (m) => Math.round(m.traffic * 0.7 * (calcScore(m) / 100));
const calcCPM = (m) => Math.round((m.price / (calcImp(m) * 30)) * 1000);

const calcAdvancedScore = (m) => {
  const sizeScore = { Small: 40, Medium: 60, Large: 85, XLarge: 100 }[m.size] || 50;
  const heightScore = Math.min((m.height / 15) * 100, 100);
  const lightingScore = m.hasLight === 'Yes' ? 100 : 60;
  const physical = Math.round(sizeScore * 0.5 + heightScore * 0.3 + lightingScore * 0.2);

  const lanes = m.streetLanes || 2;
  const visibleLanes = (m.visibleFromLanes || []).length || lanes;
  const laneRatio = visibleLanes / lanes;
  const laneScore = laneRatio * 100;

  let obstaclePenalty = 0;
  if (m.hasObstacle) {
    const pct = m.obstaclePercent || 0;
    const affectedLanes = (m.obstacleAffectsLanes || []).length;
    const laneImpact = affectedLanes / lanes;
    let penalty = pct * 0.7 + laneImpact * 30;
    if (m.obstacleRemovable) penalty *= 0.6;
    obstaclePenalty = Math.min(penalty, 80);
  }
  const angleScore = m.boardAngle === 'Direct' ? 100 : 65;
  const obstructionScore = m.obstruction === 'None' ? 100 : m.obstruction === 'Tree' ? 65 : 75;
  const visRaw = laneScore * 0.45 + angleScore * 0.25 + obstructionScore * 0.30;
  const visibility = Math.max(0, Math.round(visRaw - obstaclePenalty));

  const traffic = Math.round(Math.min((m.traffic / 130000) * 100, 100));
  const cpm = calcCPM(m);
  const value = Math.round(Math.max(0, Math.min(100, 100 - (cpm / 30))));
  const total = Math.round(physical * 0.25 + visibility * 0.35 + traffic * 0.25 + value * 0.15);

  const issues = [];
  if (m.hasObstacle) issues.push({ severity: m.obstaclePercent >= 50 ? 'high' : m.obstaclePercent >= 25 ? 'medium' : 'low', titleFa: 'مانع فیزیکی', titleEn: 'Physical Obstacle', impact: -Math.round(obstaclePenalty) });
  if (visibleLanes < lanes) issues.push({ severity: laneRatio < 0.5 ? 'high' : 'medium', titleFa: 'دید محدود لاین', titleEn: 'Limited Lane Visibility', impact: -Math.round((1 - laneRatio) * 45) });
  if (m.hasLight === 'No') issues.push({ severity: 'medium', titleFa: 'بدون نورپردازی', titleEn: 'No Lighting', impact: -8 });
  if (m.boardAngle === 'Angled') issues.push({ severity: 'low', titleFa: 'تابلوی زاویه‌دار', titleEn: 'Angled Board', impact: -9 });

  return { physical, visibility, traffic, value, total, issues };
};

const SCORE_GRADE = (s) => s >= 85 ? { label: 'A+', color: '#10b981' } : s >= 75 ? { label: 'A', color: '#22c55e' } : s >= 65 ? { label: 'B', color: '#3b82f6' } : s >= 55 ? { label: 'C', color: '#f59e0b' } : s >= 40 ? { label: 'D', color: '#f97316' } : { label: 'F', color: '#ef4444' };

// Geometry helpers
const toRad = (d) => d * Math.PI / 180;
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};
const pointToSegment = (p, a, b) => {
  const mLat = 111320, mLng = 111320 * Math.cos(toRad(a.lat));
  const bx = (b.lng - a.lng) * mLng, by = (b.lat - a.lat) * mLat;
  const px = (p.lng - a.lng) * mLng, py = (p.lat - a.lat) * mLat;
  const lenSq = bx*bx + by*by;
  let t = lenSq === 0 ? 0 : (px * bx + py * by) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = t * bx, cy = t * by;
  const d = Math.sqrt((px - cx)**2 + (py - cy)**2);
  return { distance: d, t, projLat: a.lat + (cy / mLat), projLng: a.lng + (cx / mLng) };
};
const closestOnRoute = (point, route) => {
  let best = null;
  for (let i = 0; i < route.length - 1; i++) {
    const r = pointToSegment(point, route[i], route[i+1]);
    if (!best || r.distance < best.distance) best = { ...r, segIdx: i };
  }
  return best;
};
const distanceAlongRoute = (route, segIdx, t) => {
  let total = 0;
  for (let i = 0; i < segIdx; i++) total += haversine(route[i].lat, route[i].lng, route[i+1].lat, route[i+1].lng);
  total += haversine(route[segIdx].lat, route[segIdx].lng, route[segIdx+1].lat, route[segIdx+1].lng) * t;
  return total;
};

// Bearing in degrees from geographic direction string. 0 = North, increases clockwise.
const bearingFromGeoDir = (dir) => {
  const m = { North: 0, Northeast: 45, East: 90, Southeast: 135, South: 180, Southwest: 225, West: 270, Northwest: 315 };
  return m[dir] ?? 0;
};

// Build a sector polygon (cone) anchored at the billboard, facing the geoDirection,
// with the given radius (meters) and total opening angle (default 70 deg → ±35 deg).
// Returns an array of [lat, lng] points suitable for L.polygon.
const buildVisibilityCone = (lat, lng, geoDir, radiusMeters, openingDeg = 70) => {
  const bearing = bearingFromGeoDir(geoDir);
  const half = openingDeg / 2;
  const mPerDegLat = 111320;
  const mPerDegLng = 111320 * Math.cos(lat * Math.PI / 180);
  const pts = [[lat, lng]];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const ang = bearing - half + (i / steps) * openingDeg;
    const rad = ang * Math.PI / 180;
    const dLat = (radiusMeters * Math.cos(rad)) / mPerDegLat;
    const dLng = (radiusMeters * Math.sin(rad)) / mPerDegLng;
    pts.push([lat + dLat, lng + dLng]);
  }
  return pts;
};

const normalizeAsset = (a) => {
  const lanes = a.streetLanes ?? (a.size === 'XLarge' ? 4 : a.size === 'Large' ? 3 : 2);
  const allLanes = Array.from({ length: lanes }, (_, i) => i + 1);
  const visibleFromLanes = a.visibleFromLanes ?? allLanes;
  const hasObstacle = a.hasObstacle ?? (a.obstruction && a.obstruction !== 'None');
  const obstaclePercent = a.obstaclePercent ?? (hasObstacle ? 25 : 0);
  const obstacleRemovable = a.obstacleRemovable ?? false;
  const obstacleAffectsLanes = a.obstacleAffectsLanes ?? (hasObstacle ? [1] : []);
  const imageCode = a.imageCode ?? `UMI-${String(a.id).padStart(4, '0')}`;
  const images = Array.isArray(a.images) ? a.images : [];
  const avgSpeed = a.avgSpeed ?? 50;
  const avgViewTime = a.avgViewTime ?? 3.5;
  const detectionRadius = a.detectionRadius ?? 150;
  // Board face dimensions (meters): width × height. structureHeight = ground to bottom of board (pole/structure height).
  const defaultWidth = { Small: 3, Medium: 6, Large: 10, XLarge: 14 }[a.size] || 6;
  const width = a.width ?? defaultWidth;
  const structureHeight = a.structureHeight ?? 5;
  return { ...a, streetLanes: lanes, visibleFromLanes, hasObstacle, obstaclePercent, obstacleRemovable, obstacleAffectsLanes, imageCode, images, avgSpeed, avgViewTime, detectionRadius, width, structureHeight };
};

const TYPE_COLORS = { Billboard: '#3b82f6', Banner: '#10b981', Citylight: '#f59e0b' };
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#ec4899', '#84cc16'];

const useReveal = (threshold = 0) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold, rootMargin: '0px 0px -10% 0px' });
    obs.observe(ref.current);
    // Fallback: if observer doesn't fire within 800ms (e.g., already in view but missed), force show
    const fallback = setTimeout(() => setVisible(true), 800);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, [threshold]);
  return [ref, visible];
};
const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>{children}</div>;
};
const Counter = ({ value, duration = 1200, prefix = '', suffix = '', decimals = 0 }) => {
  const [n, setN] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const target = typeof value === 'number' ? value : parseFloat(value) || 0;
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, visible, duration]);
  return <span ref={ref}>{prefix}{n.toFixed(decimals)}{suffix}</span>;
};

const STORAGE_KEY = 'umi_app_state_v2';

// ═══════════════════════════════════════════════════════════════════════════
// FONT CONFIG — change these two lines to switch fonts globally
// ═══════════════════════════════════════════════════════════════════════════
const FONT_FA = "'Vazirmatn', 'IRANSans', 'Estedad', system-ui, sans-serif";
const FONT_EN = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
// To use a Google Font, also add it to your index.html <head>:
//   <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300..800&display=swap" rel="stylesheet">
//   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap" rel="stylesheet">
// ═══════════════════════════════════════════════════════════════════════════

const loadState = async () => { try { if (!window.storage) return null; const r = await window.storage.get(STORAGE_KEY); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const saveState = async (state) => { try { if (!window.storage) return; await window.storage.set(STORAGE_KEY, JSON.stringify(state)); } catch {} };

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function UMIPlatform() {
  const [lang, setLang] = useState('fa');
  const t = I18N[lang];
  const dir = t._dir;
  const tName = (a) => lang === 'fa' ? (a.nameFa || a.name) : a.name;
  const cityName = (c) => lang === 'fa' ? (CITY_COORDS[c]?.fa || c) : c;
  const typeName = (ty) => lang === 'fa' ? (ty === 'Billboard' ? 'بیلبورد' : ty === 'Banner' ? 'بنر' : ty === 'Citylight' ? 'سیتی‌لایت' : ty) : ty;
  const dirLabel = (d) => {
    if (lang !== 'fa') return d || '';
    const m = { North: 'شمال', South: 'جنوب', East: 'شرق', West: 'غرب', Northeast: 'شمال‌شرق', Northwest: 'شمال‌غرب', Southeast: 'جنوب‌شرق', Southwest: 'جنوب‌غرب' };
    return m[d] || d || '';
  };

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [users, setUsers] = useState([
    { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin', permissions: ['view','add','edit','delete','optimize','manage_users','import_export'] },
    { id: 2, username: 'manager', password: 'manager123', name: 'Manager User', role: 'manager', permissions: ['view','add','edit','optimize'] },
    { id: 3, username: 'viewer', password: 'viewer123', name: 'Viewer User', role: 'viewer', permissions: ['view'] }
  ]);

  const [assets, setAssets] = useState(ALL_DEFAULT_ASSETS.map(normalizeAsset));
  const [selected, setSelected] = useState([]);
  const [budget, setBudget] = useState(200000000);
  const [optimizationStrategy, setOptimizationStrategy] = useState('quantity');
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [optimizationWeights, setOptimizationWeights] = useState({ quantity: 50, view: 30, coverage: 20 });
  const [view, setView] = useState('map');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'viewer', permissions: ['view'] });
  const [showAssetHistory, setShowAssetHistory] = useState(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showEditAsset, setShowEditAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(null);
  const [newBrand, setNewBrand] = useState({ brand: '', date: '', endDate: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showImageManager, setShowImageManager] = useState(null);
  const [imageLightbox, setImageLightbox] = useState(null);
  const [imageUploadMeta, setImageUploadMeta] = useState({ brand: '', campaignDate: '', notes: '' });

  // Map filters
  const [mapFilterCity, setMapFilterCity] = useState('all');
  const [mapFilterType, setMapFilterType] = useState('all');
  const [mapFilterStatus, setMapFilterStatus] = useState('all');
  const [mapShowRadius, setMapShowRadius] = useState(false);

  // History filters
  const [historyFilterBrand, setHistoryFilterBrand] = useState('all');
  const [historyFilterCity, setHistoryFilterCity] = useState('all');
  const [historyFilterType, setHistoryFilterType] = useState('all');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');

  // Budget filters
  const [budgetViewMode, setBudgetViewMode] = useState('grid');
  const [budgetFilterCity, setBudgetFilterCity] = useState('all');
  const [budgetFilterType, setBudgetFilterType] = useState('all');
  const [budgetSortBy, setBudgetSortBy] = useState('score');
  const [budgetWeeks, setBudgetWeeks] = useState(4);

  // Analytics filters
  const [anFilterCity, setAnFilterCity] = useState('all');
  const [anFilterType, setAnFilterType] = useState('all');
  const [anFilterCampaign, setAnFilterCampaign] = useState('all');
  const [anMinImp, setAnMinImp] = useState(0);

  // 3D
  // Gallery navigation
  const [galleryBrand, setGalleryBrand] = useState(null);
  const [galleryAsset, setGalleryAsset] = useState(null);
  // Gallery filters (multi-select)
  const [galleryFilterCities, setGalleryFilterCities] = useState([]);
  const [galleryFilterBrands, setGalleryFilterBrands] = useState([]);
  const [galleryDateFrom, setGalleryDateFrom] = useState('');
  const [galleryDateTo, setGalleryDateTo] = useState('');
  const [galleryFilterOpen, setGalleryFilterOpen] = useState(false);

  // Navigation
  const [navOrigin, setNavOrigin] = useState(null);
  const [navDest, setNavDest] = useState(null);
  const [navOriginQuery, setNavOriginQuery] = useState('');
  const [navDestQuery, setNavDestQuery] = useState('');
  const [navOriginSuggestions, setNavOriginSuggestions] = useState([]);
  const [navDestSuggestions, setNavDestSuggestions] = useState([]);
  const [navRoute, setNavRoute] = useState(null);
  const [navLoading, setNavLoading] = useState(false);
  const [navError, setNavError] = useState(null);
  const [navPickMode, setNavPickMode] = useState(null);
  const [navVisibilityRadius, setNavVisibilityRadius] = useState(500);
  const [navAvgSpeed, setNavAvgSpeed] = useState(50);
  const [navCityFilter, setNavCityFilter] = useState('all');
  const navMapRef = useRef(null);
  const navMapInst = useRef(null);

  const mapRef = useRef(null);
  const mapInst = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await loadState();
      if (!cancelled && saved) {
        if (saved.assets) setAssets(saved.assets.map(normalizeAsset));
        if (saved.users) setUsers(saved.users);
        if (saved.selected) setSelected(saved.selected);
        if (saved.budget) setBudget(saved.budget);
        if (saved.lang) setLang(saved.lang);
      }
      setStorageReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const t = setTimeout(() => saveState({ assets, users, selected, budget, lang }), 500);
    return () => clearTimeout(t);
  }, [assets, users, selected, budget, lang, storageReady]);

  const hasPermission = (perm) => user && user.permissions.includes(perm);

  const allPermissions = [
    { id: 'view', name: t.permView, desc: t.permViewD },
    { id: 'add', name: t.permAdd, desc: t.permAddD },
    { id: 'edit', name: t.permEdit, desc: t.permEditD },
    { id: 'delete', name: t.permDelete, desc: t.permDeleteD },
    { id: 'optimize', name: t.permOptimize, desc: t.permOptimizeD },
    { id: 'manage_users', name: t.permUsers, desc: t.permUsersD },
    { id: 'import_export', name: t.permIE, desc: t.permIED }
  ];

  const exportAssets = () => {
    const blob = new Blob([JSON.stringify(assets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `assets_${new Date().toISOString().split('T')[0]}.json`; link.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'fa' ? 'تابلوها صادر شد' : 'Assets exported');
  };
  const importAssets = (event) => {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try { const data = JSON.parse(e.target.result); if (!Array.isArray(data)) throw new Error(); setAssets(data.map(normalizeAsset)); setShowImportExport(false); showToast(lang === 'fa' ? 'وارد شد' : 'Imported'); }
      catch { showToast(lang === 'fa' ? 'خطا در وارد کردن' : 'Import error', 'error'); }
    };
    reader.readAsText(file);
  };
  const saveAsset = () => { if (editingAsset) { setAssets(assets.map(a => a.id === editingAsset.id ? normalizeAsset(editingAsset) : a)); setShowEditAsset(false); setEditingAsset(null); showToast(lang === 'fa' ? 'به‌روزرسانی شد' : 'Asset updated'); } };
  const addAsset = () => { if (!editingAsset?.name) { showToast(lang === 'fa' ? 'نام الزامی است' : 'Name required', 'error'); return; } const id = Math.max(...assets.map(a => a.id), 0) + 1; setAssets([...assets, normalizeAsset({ ...editingAsset, id, brandHistory: [] })]); setShowAddAsset(false); setEditingAsset(null); showToast(lang === 'fa' ? 'افزوده شد' : 'Asset added'); };
  const deleteAsset = (id) => { setAssets(assets.filter(a => a.id !== id)); setSelected(selected.filter(s => s !== id)); setConfirmDelete(null); showToast(lang === 'fa' ? 'حذف شد' : 'Deleted'); };
  const addBrandToHistory = () => { if (!showAddBrand || !newBrand.brand || !newBrand.date) { showToast(lang === 'fa' ? 'برند و تاریخ شروع الزامی' : 'Brand and date required', 'error'); return; } setAssets(assets.map(a => { if (a.id !== showAddBrand.id) return a; const history = [...(a.brandHistory || []), { brand: newBrand.brand, date: newBrand.date, endDate: newBrand.endDate || null }]; return { ...a, brandHistory: history, ...(newBrand.endDate ? {} : { brand: newBrand.brand, status: 'booked' }) }; })); setShowAddBrand(null); setNewBrand({ brand: '', date: '', endDate: '' }); showToast(lang === 'fa' ? 'کمپین افزوده شد' : 'Campaign added'); };
  const removeBrandFromHistory = (assetId, idx) => { setAssets(assets.map(a => { if (a.id !== assetId) return a; return { ...a, brandHistory: (a.brandHistory || []).filter((_, i) => i !== idx) }; })); showToast(lang === 'fa' ? 'حذف شد' : 'Removed'); };

  const addImageToAsset = (assetId, imageObj) => setAssets(assets.map(a => a.id === assetId ? { ...a, images: [...(a.images || []), imageObj] } : a));
  const removeImageFromAsset = (assetId, imageId) => { setAssets(assets.map(a => a.id === assetId ? { ...a, images: (a.images || []).filter(im => im.id !== imageId) } : a)); showToast(lang === 'fa' ? 'تصویر حذف شد' : 'Image removed'); };
  const handleImageUpload = (assetId, files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) { showToast(`${file.name} ✗`, 'error'); return; }
      if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} > 5MB`, 'error'); return; }
      const reader = new FileReader();
      reader.onload = (e) => addImageToAsset(assetId, { id: `img-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, url: e.target.result, date: new Date().toISOString().split('T')[0], source: 'manual', brand: imageUploadMeta.brand || null, campaignDate: imageUploadMeta.campaignDate || null, notes: imageUploadMeta.notes || null });
      reader.readAsDataURL(file);
    });
    setImageUploadMeta({ brand: '', campaignDate: '', notes: '' });
  };

  const login = () => { setIsLoading(true); setTimeout(() => { const found = users.find(u => u.username === username && u.password === password); if (found) { setUser(found); setError(''); } else setError(t.invalidCreds); setIsLoading(false); }, 400); };
  const logout = () => { setUser(null); setUsername(''); setPassword(''); setError(''); };
  const saveUser = () => { if (editingUser) setUsers(users.map(u => u.id === editingUser.id ? editingUser : u)); else { const id = Math.max(...users.map(u => u.id), 0) + 1; setUsers([...users, { ...newUser, id }]); } setShowUserModal(false); setEditingUser(null); setNewUser({ username: '', password: '', name: '', role: 'viewer', permissions: ['view'] }); showToast(lang === 'fa' ? 'ذخیره شد' : 'User saved'); };
  const deleteUser = (uid) => { if (uid === user.id) { showToast(t.cannotDeleteSelf, 'error'); return; } setUsers(users.filter(u => u.id !== uid)); showToast(lang === 'fa' ? 'حذف شد' : 'User deleted'); };
  const togglePermission = (perm, isEditing = false) => { const target = isEditing ? editingUser : newUser; const perms = target.permissions.includes(perm) ? target.permissions.filter(p => p !== perm) : [...target.permissions, perm]; if (isEditing) setEditingUser({ ...editingUser, permissions: perms }); else setNewUser({ ...newUser, permissions: perms }); };
  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const enriched = useMemo(() => assets.map(m => ({ ...m, score: calcScore(m), daily: calcImp(m), monthly: calcImp(m) * 30, cpm: calcCPM(m) })), [assets]);
  const uniqueCities = useMemo(() => Array.from(new Set(assets.map(a => a.city).filter(Boolean))), [assets]);

  const optimize = () => {
    setIsLoading(true);
    setTimeout(() => {
      const avail = enriched.filter(m => m.status === 'available');
      let sel = [], rem = budget;
      if (optimizationStrategy === 'quantity') [...avail].sort((a, b) => a.price - b.price).forEach(m => { if (rem >= m.price) { sel.push(m.id); rem -= m.price; } });
      else if (optimizationStrategy === 'view') [...avail].sort((a, b) => a.cpm - b.cpm).forEach(m => { if (rem >= m.price) { sel.push(m.id); rem -= m.price; } });
      else if (optimizationStrategy === 'coverage') {
        const byCity = {}; avail.forEach(m => { (byCity[m.city] = byCity[m.city] || []).push(m); });
        const cities = Object.keys(byCity); let i = 0;
        while (rem > 0 && sel.length < avail.length) { const city = cities[i % cities.length]; const cand = byCity[city].filter(m => !sel.includes(m.id)).sort((a, b) => b.score - a.score)[0]; if (cand && rem >= cand.price) { sel.push(cand.id); rem -= cand.price; } i++; if (i > cities.length * 20) break; }
      } else if (optimizationStrategy === 'type') {
        const byType = {}; avail.forEach(m => { (byType[m.type] = byType[m.type] || []).push(m); });
        const types = Object.keys(byType); let i = 0;
        while (rem > 0 && sel.length < avail.length) { const ty = types[i % types.length]; const cand = byType[ty].filter(m => !sel.includes(m.id)).sort((a, b) => a.cpm - b.cpm)[0]; if (cand && rem >= cand.price) { sel.push(cand.id); rem -= cand.price; } i++; if (i > types.length * 30) break; }
      } else if (optimizationStrategy === 'mixed') {
        const maxP = Math.max(...avail.map(a => a.price)), maxT = Math.max(...avail.map(a => a.traffic));
        const scored = avail.map(m => ({ ...m, fs: (((maxP - m.price) / maxP) * 100 * optimizationWeights.quantity / 100) + ((m.traffic / maxT) * 100 * optimizationWeights.view / 100) + (m.score * optimizationWeights.coverage / 100) }));
        scored.sort((a, b) => b.fs - a.fs).forEach(m => { if (rem >= m.price) { sel.push(m.id); rem -= m.price; } });
      }
      setSelected(sel); setShowOptimizationModal(false); setIsLoading(false);
      showToast(lang === 'fa' ? `${sel.length} تابلو انتخاب شد` : `Optimized: ${sel.length} selected`);
    }, 700);
  };

  // Geocoding + routing
  const geocode = useCallback(async (query) => {
    if (!query || query.length < 3) return [];
    try { const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`); const data = await r.json(); return data.map(d => ({ lat: parseFloat(d.lat), lng: parseFloat(d.lon), label: d.display_name, short: d.display_name.split(',').slice(0, 2).join(', ') })); } catch { return []; }
  }, []);
  useEffect(() => { if (!navOriginQuery || navOriginQuery.length < 3) { setNavOriginSuggestions([]); return; } const t = setTimeout(async () => setNavOriginSuggestions(await geocode(navOriginQuery)), 400); return () => clearTimeout(t); }, [navOriginQuery, geocode]);
  useEffect(() => { if (!navDestQuery || navDestQuery.length < 3) { setNavDestSuggestions([]); return; } const t = setTimeout(async () => setNavDestSuggestions(await geocode(navDestQuery)), 400); return () => clearTimeout(t); }, [navDestQuery, geocode]);
  const fetchRoute = useCallback(async (o, d) => {
    if (!o || !d) return; setNavLoading(true); setNavError(null);
    try { const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${o.lng},${o.lat};${d.lng},${d.lat}?overview=full&geometries=geojson`); const data = await r.json(); if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No route'); const route = data.routes[0]; setNavRoute({ coordinates: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })), distance: route.distance, duration: route.duration }); }
    catch (e) { setNavError(lang === 'fa' ? 'سرویس مسیریابی در دسترس نیست' : (e.message || 'Routing unavailable')); setNavRoute(null); }
    finally { setNavLoading(false); }
  }, [lang]);
  useEffect(() => { if (navOrigin && navDest) fetchRoute(navOrigin, navDest); else setNavRoute(null); }, [navOrigin, navDest, fetchRoute]);

  const routeVisibility = useMemo(() => {
    if (!navRoute || !navRoute.coordinates || navRoute.coordinates.length < 2) return [];
    const results = [];
    enriched.forEach(asset => {
      const a = normalizeAsset(asset);
      const closest = closestOnRoute({ lat: a.lat, lng: a.lng }, navRoute.coordinates);
      if (!closest) return;
      // Slider is the only filter — any asset within this corridor around the route is included.
      if (closest.distance > navVisibilityRadius) return;
      const distAlong = distanceAlongRoute(navRoute.coordinates, closest.segIdx, closest.t);
      const sightDistance = Math.max(50, 220 - closest.distance * 1.2);
      const speedMs = navAvgSpeed * 1000 / 3600;
      let viewSeconds = sightDistance / speedMs;
      if (a.hasObstacle) viewSeconds *= (1 - (a.obstaclePercent / 100) * 0.6);
      const distanceScore = Math.max(0, 100 - (closest.distance / navVisibilityRadius) * 100);
      const lanesScore = (a.visibleFromLanes.length / a.streetLanes) * 100;
      const obstaclePenalty = a.hasObstacle ? (a.obstaclePercent * 0.5) : 0;
      const visibilityScore = Math.round(Math.max(0, distanceScore * 0.5 + lanesScore * 0.3 + (100 - obstaclePenalty) * 0.2));
      results.push({ asset: a, distance: Math.round(closest.distance), distanceAlong: Math.round(distAlong), viewSeconds: Math.max(0.5, viewSeconds), visibilityScore, projLat: closest.projLat, projLng: closest.projLng });
    });
    return results.sort((a, b) => a.distanceAlong - b.distanceAlong);
  }, [navRoute, enriched, navVisibilityRadius, navAvgSpeed]);

  // ---- MAP ----
  const mapFiltered = useMemo(() => enriched.filter(m =>
    (mapFilterCity === 'all' || m.city === mapFilterCity) &&
    (mapFilterType === 'all' || m.type === mapFilterType) &&
    (mapFilterStatus === 'all' || m.status === mapFilterStatus)
  ), [enriched, mapFilterCity, mapFilterType, mapFilterStatus]);

  useEffect(() => {
    if (view !== 'map' || !mapRef.current) return;
    if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    if (!document.querySelector('link[href*="leaflet.css"]')) { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'; document.head.appendChild(link); }
    const init = () => {
      if (!window.L || !mapRef.current) return;
      mapRef.current.innerHTML = '';
      const map = window.L.map(mapRef.current, { center: [33.5, 52], zoom: 5, zoomControl: true });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
      const bounds = [];
      mapFiltered.forEach(m => {
        const isSel = selected.includes(m.id);
        const col = m.status === 'booked' ? '#6b7280' : isSel ? '#10b981' : (TYPE_COLORS[m.type] || '#3b82f6');
        if (mapShowRadius) {
          const cone = buildVisibilityCone(m.lat, m.lng, m.geoDirection || 'North', m.detectionRadius || 150);
          window.L.polygon(cone, { color: col, fillColor: col, fillOpacity: 0.18, weight: 1.5, dashArray: '6 5' }).addTo(map);
        }
        const html = `<svg width="32" height="42" viewBox="0 0 24 32"><path fill="${col}" stroke="white" stroke-width="2" d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/></svg>`;
        const icon = window.L.divIcon({ html, className: '', iconSize: [32, 42], iconAnchor: [16, 42] });
        const marker = window.L.marker([m.lat, m.lng], { icon }).addTo(map);
        bounds.push([m.lat, m.lng]);
        const dirTxt = dir === 'rtl' ? 'rtl' : 'ltr';
        const popup = `<div style="font-family:${dirTxt === 'rtl' ? FONT_FA : FONT_EN};min-width:210px;direction:${dirTxt}">
          <div style="font-size:14px;font-weight:700;color:#0f172a">${tName(m)}</div>
          <div style="font-size:11px;color:#64748b;margin-bottom:8px">${cityName(m.city)} · ${typeName(m.type)}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:10px">
            <div style="background:#dbeafe;padding:5px 7px;border-radius:6px"><div style="color:#1e40af;font-weight:600">${t.traffic}</div><div style="color:#1e3a8a;font-weight:700">${(m.traffic/1000).toFixed(0)}K</div></div>
            <div style="background:#dcfce7;padding:5px 7px;border-radius:6px"><div style="color:#15803d;font-weight:600">${t.price}</div><div style="color:#166534;font-weight:700">${(m.price/1000000).toFixed(0)}M</div></div>
            <div style="background:#fef3c7;padding:5px 7px;border-radius:6px"><div style="color:#92400e;font-weight:600">${t.visibilityRadius}</div><div style="color:#78350f;font-weight:700">${m.detectionRadius}m → ${dirLabel(m.geoDirection)}</div></div>
            <div style="background:#f3e8ff;padding:5px 7px;border-radius:6px"><div style="color:#6b21a8;font-weight:600">${t.score}</div><div style="color:#581c87;font-weight:700">${m.score}</div></div>
            <div style="background:#e0f2fe;padding:5px 7px;border-radius:6px"><div style="color:#0369a1;font-weight:600">${t.avgSpeed}</div><div style="color:#075985;font-weight:700">${m.avgSpeed} km/h</div></div>
            <div style="background:#ffe4e6;padding:5px 7px;border-radius:6px"><div style="color:#be123c;font-weight:600">${t.viewTime}</div><div style="color:#9f1239;font-weight:700">${m.avgViewTime}s</div></div>
          </div>
          <div style="font-size:10px;color:#94a3b8;margin-top:8px">${m.agency} · ${m.size} · ${m.width || '?'}×${m.height}m</div>
        </div>`;
        marker.bindPopup(popup, { maxWidth: 270 });
      });
      if (bounds.length > 0) { try { map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 }); } catch {} }
      mapInst.current = map;
      setTimeout(() => map && map.invalidateSize(), 120);
    };
    if (window.L) init();
    else { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'; s.onload = init; document.head.appendChild(s); }
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; } };
  }, [view, mapFiltered, selected, mapShowRadius, lang]);

  // ---- NAVIGATION MAP ----
  useEffect(() => {
    if (view !== 'navigation' || !navMapRef.current) return;
    if (navMapInst.current) { navMapInst.current.remove(); navMapInst.current = null; }
    if (!document.querySelector('link[href*="leaflet.css"]')) { const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'; document.head.appendChild(link); }
    const init = () => {
      if (!window.L || !navMapRef.current) return;
      navMapRef.current.innerHTML = '';
      // Default to Iran-wide view; city filter zooms in
      const map = window.L.map(navMapRef.current, { center: [32.5, 53.5], zoom: 5, zoomControl: true });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

      map.on('click', (e) => { const { lat, lng } = e.latlng; const label = `${lat.toFixed(4)}, ${lng.toFixed(4)}`; if (navPickMode === 'origin') { setNavOrigin({ lat, lng, label, short: label }); setNavOriginQuery(label); setNavPickMode(null); } else if (navPickMode === 'dest') { setNavDest({ lat, lng, label, short: label }); setNavDestQuery(label); setNavPickMode(null); } });

      // -- Show ALL assets from the data (filtered by selected city) as small markers --
      const visibleAssets = enriched.filter(a => navCityFilter === 'all' || a.city === navCityFilter);
      const routeAssetIds = new Set(routeVisibility.map(rv => rv.asset.id));
      visibleAssets.forEach(a => {
        if (routeAssetIds.has(a.id)) return; // route assets get a richer marker below
        const col = a.status === 'booked' ? '#6b7280' : (TYPE_COLORS[a.type] || '#3b82f6');
        const html = `<div style="width:14px;height:14px;border-radius:50%;background:${col};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);opacity:0.75"></div>`;
        const icon = window.L.divIcon({ html, className: '', iconSize: [14, 14], iconAnchor: [7, 7] });
        const m = window.L.marker([a.lat, a.lng], { icon }).addTo(map);
        m.bindPopup(`<div style="font-family:${dir === 'rtl' ? FONT_FA : FONT_EN};min-width:180px;direction:${dir}"><div style="font-size:13px;font-weight:700;color:#0f172a">${tName(a)}</div><div style="font-size:11px;color:#64748b;margin-bottom:6px">${cityName(a.city)} · ${typeName(a.type)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:10px"><div style="background:#dbeafe;padding:4px 6px;border-radius:5px"><div style="color:#1e40af;font-weight:600">${t.traffic}</div><div style="color:#1e3a8a;font-weight:700">${(a.traffic/1000).toFixed(0)}K</div></div><div style="background:#fef3c7;padding:4px 6px;border-radius:5px"><div style="color:#92400e;font-weight:600">${t.visibilityRadius}</div><div style="color:#78350f;font-weight:700">${a.detectionRadius}m</div></div></div></div>`, { maxWidth: 240 });
      });

      if (navOrigin) { const icon = window.L.divIcon({ html: `<div style="background:#10b981;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4)">A</div>`, className: '', iconSize: [30, 30], iconAnchor: [15, 15] }); window.L.marker([navOrigin.lat, navOrigin.lng], { icon }).addTo(map); }
      if (navDest) { const icon = window.L.divIcon({ html: `<div style="background:#ef4444;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4)">B</div>`, className: '', iconSize: [30, 30], iconAnchor: [15, 15] }); window.L.marker([navDest.lat, navDest.lng], { icon }).addTo(map); }
      if (navRoute && navRoute.coordinates.length > 1) {
        const latlngs = navRoute.coordinates.map(c => [c.lat, c.lng]);
        window.L.polyline(latlngs, { color: '#3b82f6', weight: navVisibilityRadius / 8, opacity: 0.12 }).addTo(map);
        window.L.polyline(latlngs, { color: '#3b82f6', weight: 5, opacity: 0.9 }).addTo(map);
      }
      routeVisibility.forEach((rv) => {
        const a = rv.asset; const col = TYPE_COLORS[a.type] || '#3b82f6';
        const ring = rv.visibilityScore > 70 ? '#10b981' : rv.visibilityScore > 40 ? '#f59e0b' : '#ef4444';
        const html = `<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:4px;border-radius:50%;background:${col};border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${rv.visibilityScore}</div></div>`;
        const icon = window.L.divIcon({ html, className: '', iconSize: [34, 34], iconAnchor: [17, 17] });
        const marker = window.L.marker([a.lat, a.lng], { icon }).addTo(map);
        window.L.polyline([[a.lat, a.lng], [rv.projLat, rv.projLng]], { color: ring, weight: 2, dashArray: '4 4', opacity: 0.6 }).addTo(map);
        marker.bindPopup(`<div style="font-family:${dir === 'rtl' ? FONT_FA : FONT_EN};min-width:200px;direction:${dir}"><div style="font-size:14px;font-weight:700;color:#0f172a">${tName(a)}</div><div style="font-size:11px;color:#64748b;margin-bottom:8px">${cityName(a.city)} · ${typeName(a.type)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px"><div style="background:#dbeafe;padding:6px;border-radius:6px"><div style="color:#1e40af;font-weight:600;font-size:9px">${t.distance}</div><div style="color:#1e3a8a;font-weight:700">${rv.distance}m</div></div><div style="background:#dcfce7;padding:6px;border-radius:6px"><div style="color:#15803d;font-weight:600;font-size:9px">${t.viewTime}</div><div style="color:#166534;font-weight:700">${rv.viewSeconds.toFixed(1)}s</div></div></div></div>`, { maxWidth: 260 });
      });

      // -- View priority: route > city filter > default --
      if (navRoute && navRoute.coordinates.length > 1) {
        try { map.fitBounds(navRoute.coordinates.map(c => [c.lat, c.lng]), { padding: [60, 60] }); } catch {}
      } else if (navCityFilter !== 'all' && CITY_COORDS[navCityFilter]) {
        const coord = CITY_COORDS[navCityFilter];
        map.setView([coord.lat, coord.lng], 12);
      }

      navMapInst.current = map;
      setTimeout(() => map && map.invalidateSize(), 120);
    };
    if (window.L) init();
    else { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'; s.onload = init; document.head.appendChild(s); }
    return () => { if (navMapInst.current) { navMapInst.current.remove(); navMapInst.current = null; } };
  }, [view, navOrigin, navDest, navRoute, routeVisibility, navPickMode, navVisibilityRadius, navCityFilter, enriched, lang, dir]);

  // ---- SCORING ANALYTICS (used in Analytics view) ----
  const cityColorMap = { Tehran: '#3b82f6', Mashhad: '#a855f7', Isfahan: '#10b981', Shiraz: '#f59e0b', Tabriz: '#ef4444' };


  // ---- HISTORY ----
  const allHistoryEntries = useMemo(() => {
    const entries = [];
    assets.forEach(asset => (asset.brandHistory || []).forEach((h, idx) => entries.push({ ...h, entryIdx: idx, assetId: asset.id, assetName: asset.name, assetNameFa: asset.nameFa, assetType: asset.type, agency: asset.agency, city: asset.city || 'Unknown' })));
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [assets]);
  const filteredHistory = useMemo(() => allHistoryEntries.filter(e => {
    const brandM = historyFilterBrand === 'all' || e.brand === historyFilterBrand;
    const typeM = historyFilterType === 'all' || e.assetType === historyFilterType;
    const cityM = historyFilterCity === 'all' || e.city === historyFilterCity;
    let dateM = true;
    if (historyDateFrom) dateM = dateM && new Date(e.date) >= new Date(historyDateFrom);
    if (historyDateTo) dateM = dateM && new Date(e.date) <= new Date(historyDateTo);
    return brandM && typeM && cityM && dateM;
  }), [allHistoryEntries, historyFilterBrand, historyFilterType, historyFilterCity, historyDateFrom, historyDateTo]);
  const uniqueBrands = useMemo(() => Array.from(new Set(allHistoryEntries.map(e => e.brand))), [allHistoryEntries]);
  const brandAnalytics = useMemo(() => {
    const stats = {};
    allHistoryEntries.forEach(e => { if (!stats[e.brand]) stats[e.brand] = { brand: e.brand, campaigns: 0, cities: new Set(), assets: new Set(), active: 0 }; stats[e.brand].campaigns++; stats[e.brand].cities.add(e.city); stats[e.brand].assets.add(e.assetName); if (!e.endDate) stats[e.brand].active++; });
    return Object.values(stats).map(s => ({ brand: s.brand, campaigns: s.campaigns, cities: s.cities.size, assets: s.assets.size, active: s.active })).sort((a, b) => b.campaigns - a.campaigns);
  }, [allHistoryEntries]);

  // ---- BUDGET ----
  const selData = enriched.filter(m => selected.includes(m.id));
  const totalCost = selData.reduce((s, m) => s + m.price, 0);
  const totalImp = selData.reduce((s, m) => s + m.monthly, 0);
  const budgetFilteredAssets = useMemo(() => {
    let r = enriched.filter(m => m.status === 'available');
    if (budgetFilterCity !== 'all') r = r.filter(m => m.city === budgetFilterCity);
    if (budgetFilterType !== 'all') r = r.filter(m => m.type === budgetFilterType);
    const sorters = { score: (a, b) => b.score - a.score, 'price-low': (a, b) => a.price - b.price, 'price-high': (a, b) => b.price - a.price, traffic: (a, b) => b.traffic - a.traffic, cpm: (a, b) => a.cpm - b.cpm };
    return [...r].sort(sorters[budgetSortBy]);
  }, [enriched, budgetFilterCity, budgetFilterType, budgetSortBy]);
  const budgetByCity = useMemo(() => CITY_LIST.map(c => {
    const cb = enriched.filter(m => m.city === c);
    const cost = cb.reduce((s, m) => s + m.price * budgetWeeks / 4, 0);
    return { city: c, count: cb.length, cost, inBudget: cost <= budget };
  }), [enriched, budgetWeeks, budget]);

  // ---- ANALYTICS (filtered) ----
  const anFiltered = useMemo(() => enriched
    .filter(m => anFilterCity === 'all' || m.city === anFilterCity)
    .filter(m => anFilterType === 'all' || m.type === anFilterType)
    .filter(m => anFilterCampaign === 'all' || m.brand === anFilterCampaign)
    .filter(m => m.monthly >= anMinImp), [enriched, anFilterCity, anFilterType, anFilterCampaign, anMinImp]);
  const anCampaigns = useMemo(() => Array.from(new Set(enriched.map(m => m.brand).filter(Boolean))), [enriched]);
  const analytics = useMemo(() => {
    const group = (key, arr) => { const g = {}; arr.forEach(m => { const v = m[key] || 'Unknown'; g[v] = (g[v] || 0) + 1; }); return Object.entries(g).map(([name, value]) => ({ name, value })); };
    const arr = anFiltered;
    const n = arr.length || 1;
    const sum = (k) => arr.reduce((s, m) => s + m[k], 0);
    const cityMetrics = {};
    arr.forEach(m => { const c = m.city || 'Unknown'; if (!cityMetrics[c]) cityMetrics[c] = { name: c, count: 0, traffic: 0, revenue: 0, imp: 0 }; cityMetrics[c].count++; cityMetrics[c].traffic += m.traffic; cityMetrics[c].revenue += m.price; cityMetrics[c].imp += m.monthly; });
    return {
      byType: group('type', arr), bySize: group('size', arr), byLight: group('hasLight', arr), byDirection: group('direction', arr),
      cityMetrics: Object.values(cityMetrics).map(c => ({ ...c, name: cityName(c.name), traffic: Math.round(c.traffic / 1000), revenue: Math.round(c.revenue / 1000000), imp: Math.round(c.imp / 1000) })),
      avg: { traffic: sum('traffic') / n, price: sum('price') / n, cpm: sum('cpm') / n, score: sum('score') / n },
      totals: { traffic: sum('traffic'), monthly: sum('monthly'), revenue: sum('price'), avail: arr.filter(m => m.status === 'available').length, booked: arr.filter(m => m.status === 'booked').length }
    };
  }, [anFiltered, lang]);
  const scatterData = useMemo(() => anFiltered.map(m => ({ x: Math.round(m.monthly / 1000), y: m.cpm, name: m.name })), [anFiltered]);

  // ---- GALLERY DATA: two-level tree (brand → asset → images) ----
  const galleryData = useMemo(() => {
    const byBrand = {};
    const fromTs = galleryDateFrom ? new Date(galleryDateFrom).getTime() : null;
    const toTs = galleryDateTo ? new Date(galleryDateTo).getTime() + 86400000 : null; // include end day
    assets.forEach(a => {
      // City filter
      if (galleryFilterCities.length && !galleryFilterCities.includes(a.city)) return;
      const imgs = a.images || [];
      if (!imgs.length) return;
      // Group this asset's images by brand, applying brand + date filters
      const assetGroups = {};
      imgs.forEach(im => {
        const key = im.brand || '__general__';
        if (galleryFilterBrands.length && !galleryFilterBrands.includes(key)) return;
        const dateStr = im.campaignDate || im.date;
        if (fromTs || toTs) {
          if (!dateStr) return; // exclude images without dates when date filter is active
          const ts = new Date(dateStr).getTime();
          if (isNaN(ts)) return;
          if (fromTs && ts < fromTs) return;
          if (toTs && ts > toTs) return;
        }
        if (!assetGroups[key]) assetGroups[key] = [];
        assetGroups[key].push(im);
      });
      Object.keys(assetGroups).forEach(brand => {
        if (!byBrand[brand]) byBrand[brand] = { brand, totalImages: 0, assets: [] };
        const sortedImgs = [...assetGroups[brand]].sort((x, y) => (y.campaignDate || y.date || '').localeCompare(x.campaignDate || x.date || ''));
        byBrand[brand].assets.push({ asset: a, images: sortedImgs });
        byBrand[brand].totalImages += sortedImgs.length;
      });
    });
    return Object.values(byBrand).sort((a, b) => {
      if (a.brand === '__general__') return 1;
      if (b.brand === '__general__') return -1;
      return a.brand.localeCompare(b.brand);
    });
  }, [assets, galleryFilterCities, galleryFilterBrands, galleryDateFrom, galleryDateTo]);

  // List of all known brand keys across all images (for the brand filter checklist)
  const allGalleryBrands = useMemo(() => {
    const s = new Set();
    assets.forEach(a => (a.images || []).forEach(im => s.add(im.brand || '__general__')));
    return Array.from(s).sort((a, b) => a === '__general__' ? 1 : b === '__general__' ? -1 : a.localeCompare(b));
  }, [assets]);

  const exportAnalyticsCSV = () => {
    const headers = ['ID','City','Street','Type','Size','Traffic','MonthlyImp','VisRadius','AvgSpeed','ViewTime','CPM','Score','Price','Brand','Status'];
    const rows = anFiltered.map(m => [m.id, m.city, m.name, m.type, m.size, m.traffic, m.monthly, m.detectionRadius, m.avgSpeed, m.avgViewTime, m.cpm, m.score, m.price, m.brand || '', m.status].join(','));
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `analytics_filtered_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    showToast(lang === 'fa' ? `${anFiltered.length} رکورد صادر شد` : `${anFiltered.length} records exported`);
  };

  const exportRouteCSV = () => {
    if (!routeVisibility.length) return;
    const headers = ['ID','Name','City','Type','Size','Width(m)','Height(m)','StructureHeight(m)','AtKM','DistanceFromRoute(m)','ViewTime(s)','VisibilityScore','Lanes','Traffic','Brand'];
    const rows = routeVisibility.map(rv => { const a = rv.asset; return [a.id, `"${a.name}"`, a.city, a.type, a.size, a.width || '', a.height, a.structureHeight || '', (rv.distanceAlong / 1000).toFixed(2), rv.distance, rv.viewSeconds.toFixed(1), rv.visibilityScore, `${a.visibleFromLanes?.length}/${a.streetLanes}`, a.traffic, a.brand || ''].join(','); });
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `route_billboards_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    showToast(lang === 'fa' ? `${routeVisibility.length} تابلو در مسیر صادر شد` : `${routeVisibility.length} route billboards exported`);
  };

  const Select = ({ value, onChange, children, label, icon: Icon }) => (
    <div>
      {label && <label className="text-sm mb-2 text-gray-300 flex items-center gap-2">{Icon && <Icon className="w-4 h-4" />}{label}</label>}
      <select value={value} onChange={onChange} className="w-full px-4 py-2 bg-slate-800 text-white border border-white/20 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">{children}</select>
    </div>
  );

  const LangToggle = ({ compact }) => (
    <button onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')} className={`flex items-center gap-2 ${compact ? 'px-3 py-2' : 'px-4 py-2'} bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-all magnetic-btn`} title="Language / زبان">
      <Globe className="w-4 h-4 text-blue-300" />
      <span className="text-sm font-semibold">{lang === 'fa' ? 'EN' : 'فا'}</span>
    </button>
  );

  // ═══════════════ LOGIN ═══════════════
  if (!user) {
    return (
      <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: lang === 'fa' ? FONT_FA : FONT_EN }}>
        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] animate-[float_10s_ease-in-out_infinite]"></div>
        </div>
        <div className="absolute top-4 left-4 z-20"><LangToggle /></div>
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-10" style={{ animation: 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50 animate-[float_3s_ease-in-out_infinite]"><Target className="w-10 h-10 text-white" /></div>
            <h1 className="text-3xl font-bold mb-2 text-white">{t.appName}</h1>
            <p className="text-gray-400">{t.signInToContinue}</p>
          </div>
          <div className="space-y-4">
            <div className="group">
              <label className="block text-sm mb-2 text-gray-300 font-medium">{t.username}</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} onKeyPress={e => e.key === 'Enter' && login()} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all" placeholder={t.enterUsername} />
            </div>
            <div className="group">
              <label className="block text-sm mb-2 text-gray-300 font-medium">{t.password}</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && login()} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all" placeholder={t.enterPassword} />
                <button type="button" onClick={() => setShowPass(!showPass)} className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-white`}>{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
            {error && <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm" style={{ animation: 'shake 0.4s ease-in-out' }}>{error}</div>}
            <button onClick={login} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 py-3 rounded-xl font-semibold transition-all text-white shadow-lg hover:shadow-xl disabled:opacity-50">{isLoading ? <div className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>{t.signingIn}</span></div> : t.signIn}</button>
          </div>
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl">
            <h3 className="font-semibold mb-3 text-blue-300 text-sm">{t.demoAccounts}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 px-2"><span className="text-gray-300">{t.admin}:</span><code className="bg-black/30 px-2 py-1 rounded text-white">admin / admin123</code></div>
              <div className="flex justify-between items-center py-1 px-2"><span className="text-gray-300">{t.manager}:</span><code className="bg-black/30 px-2 py-1 rounded text-white">manager / manager123</code></div>
              <div className="flex justify-between items-center py-1 px-2"><span className="text-gray-300">{t.viewer}:</span><code className="bg-black/30 px-2 py-1 rounded text-white">viewer / viewer123</code></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'map', icon: MapPin, label: t.map },
    { id: 'navigation', icon: Navigation, label: t.navigation },
    { id: 'budget', icon: Target, label: t.budget, perm: 'optimize' },
    { id: 'analytics', icon: BarChart3, label: t.analytics },
    { id: 'history', icon: History, label: t.history },
    { id: 'gallery', icon: Image, label: t.gallery },
    { id: 'users', icon: Users, label: t.users, perm: 'manage_users' },
    { id: 'about', icon: AlertCircle, label: t.about }
  ];
  const emptyAsset = { name: '', nameFa: '', type: 'Billboard', lat: 35.7, lng: 51.4, size: 'Medium', height: 5, width: 6, structureHeight: 5, traffic: 50000, price: 30000000, status: 'available', agency: '', brand: '', city: 'Tehran', obstruction: 'None', direction: 'Inbound', boardAngle: 'Direct', geoDirection: 'North', hasLight: 'Yes', avgSpeed: 50, avgViewTime: 3.5, detectionRadius: 150 };

  return (
    <div dir={dir} className="bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white flex" style={{ fontFamily: lang === 'fa' ? FONT_FA : FONT_EN, minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(16,185,129,0.7)}70%{box-shadow:0 0 0 12px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}
        .animate-fade-in{animation:fadeIn 0.5s ease-out}
        .animate-scale-in{animation:scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)}
        .animate-slide-right{animation:slideInRight 0.4s cubic-bezier(0.16,1,0.3,1)}
        .leaflet-popup-content-wrapper{border-radius:12px!important}
        .magnetic-btn{transition:transform 0.2s cubic-bezier(0.16,1,0.3,1)}
        .magnetic-btn:hover{transform:translateY(-2px)}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.05)}
        ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#3b82f6,#8b5cf6);border-radius:4px}
      `}</style>

      {/* TOAST */}
      {toast && (<div className={`fixed top-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-[100000] animate-slide-right`}><div className={`px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-green-500/20 border-green-500/50 text-green-200'}`}>{toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}<span className="font-medium">{toast.message}</span></div></div>)}

      {/* IMAGE LIGHTBOX */}
      {imageLightbox && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 animate-fade-in" style={{ zIndex: 100001 }} onClick={() => setImageLightbox(null)}>
          <button onClick={(e) => { e.stopPropagation(); setImageLightbox(null); }} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full z-10"><X className="w-6 h-6" /></button>
          <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1.5 rounded-lg">{imageLightbox.index + 1} / {imageLightbox.images.length}</div>
          {imageLightbox.images.length > 1 && (<>
            <button onClick={(e) => { e.stopPropagation(); setImageLightbox({ ...imageLightbox, index: (imageLightbox.index - 1 + imageLightbox.images.length) % imageLightbox.images.length }); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full z-10"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg></button>
            <button onClick={(e) => { e.stopPropagation(); setImageLightbox({ ...imageLightbox, index: (imageLightbox.index + 1) % imageLightbox.images.length }); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full z-10"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></button>
          </>)}
          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={imageLightbox.images[imageLightbox.index].url} alt="" className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" />
            <div className="mt-4 bg-black/70 rounded-lg px-4 py-3 text-sm">
              <div className="flex flex-wrap gap-3 items-center text-gray-300">
                <span className="text-cyan-300 font-semibold">{imageLightbox.images[imageLightbox.index].date}</span>
                {imageLightbox.images[imageLightbox.index].brand && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">{imageLightbox.images[imageLightbox.index].brand}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-0'} flex-shrink-0 transition-all duration-300 ${dir === 'rtl' ? 'order-2' : 'order-1'}`} style={{ overflow: 'hidden' }}>
        <div className="w-60 sticky top-0 bg-black/40 backdrop-blur-xl border-white/10 flex flex-col" style={{ height: '100vh', borderLeftWidth: dir === 'rtl' ? 1 : 0, borderRightWidth: dir === 'rtl' ? 0 : 1 }}>
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0"><Target className="w-6 h-6" /></div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{t.appName}</div>
                <div className="text-[10px] text-gray-500">{CITY_LIST.length} {t.cities} · {assets.length} {t.assets}</div>
              </div>
            </div>
          </div>
          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {tabs.map((tab) => {
              if (tab.perm && !hasPermission(tab.perm)) return null;
              const Icon = tab.icon; const active = view === tab.id;
              return (
                <button key={tab.id} onClick={() => setView(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-blue-200 border border-blue-500/30 font-semibold' : 'text-gray-400 hover:bg-white/5 border border-transparent'}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-start">{tab.label}</span>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </button>
              );
            })}
          </nav>
          {/* User + Lang */}
          <div className="p-3 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{user.name}</div><div className="text-[10px] text-gray-400 capitalize">{t[user.role] || user.role}</div></div>
            </div>
            <div className="flex gap-2">
              <LangToggle compact />
              <button onClick={logout} className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-xl flex items-center justify-center gap-2 border border-red-500/30 text-sm magnetic-btn"><LogOut className="w-4 h-4" />{t.logout}</button>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className={`flex-1 min-w-0 ${dir === 'rtl' ? 'order-1' : 'order-2'}`}>
        {/* Top bar */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg"><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">{tabs.find(x => x.id === view)?.label}</h1>
          </div>
          <div className="text-xs text-gray-500">{new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</div>
        </div>

        <div className="px-4 md:px-6 py-6 max-w-[1400px] mx-auto">
          {/* TOP STATS — only in Budget view, since these reflect the active selection */}
          {view === 'budget' && selected.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: t.selected, value: selected.length, color: 'blue', icon: Check, decimals: 0 },
                { label: t.reach, value: totalImp / 1000000, color: 'green', icon: TrendingUp, suffix: 'M', decimals: 1 },
                { label: t.cost, value: totalCost / 1000000, color: 'purple', icon: DollarSign, suffix: 'M', decimals: 0 }
              ].map((s) => {
                const Icon = s.icon;
                const grad = { blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30', green: 'from-green-600/20 to-green-800/20 border-green-500/30', purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30' }[s.color];
                return (<div key={s.label} className={`bg-gradient-to-br ${grad} rounded-2xl p-4 md:p-5 border backdrop-blur-sm shadow-lg`}><div className="flex items-center justify-between mb-2"><div className="text-xs md:text-sm opacity-80">{s.label}</div><Icon className="w-5 h-5 opacity-70" /></div><div className="text-2xl md:text-3xl font-bold"><Counter value={s.value} suffix={s.suffix || ''} decimals={s.decimals} /></div></div>);
              })}
            </div>
          )}

          {/* ═══ MAP VIEW ═══ */}
          {view === 'map' && (
            <div className="space-y-6 animate-fade-in">
              <Reveal>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" />{t.interactiveMap} ({mapFiltered.length})</h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <select value={mapFilterCity} onChange={e => setMapFilterCity(e.target.value)} className="px-3 py-2 bg-slate-800 text-white border border-white/20 rounded-lg text-sm focus:border-blue-500"><option value="all">{t.allCities}</option>{CITY_LIST.map(c => <option key={c} value={c}>{cityName(c)}</option>)}</select>
                      <select value={mapFilterType} onChange={e => setMapFilterType(e.target.value)} className="px-3 py-2 bg-slate-800 text-white border border-white/20 rounded-lg text-sm focus:border-blue-500"><option value="all">{t.allTypes}</option><option value="Billboard">{typeName('Billboard')}</option><option value="Banner">{typeName('Banner')}</option><option value="Citylight">{typeName('Citylight')}</option></select>
                      <select value={mapFilterStatus} onChange={e => setMapFilterStatus(e.target.value)} className="px-3 py-2 bg-slate-800 text-white border border-white/20 rounded-lg text-sm focus:border-blue-500"><option value="all">{t.allStatus}</option><option value="available">{t.available}</option><option value="booked">{t.booked}</option></select>
                      <label className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-white/20 rounded-lg text-sm cursor-pointer"><input type="checkbox" checked={mapShowRadius} onChange={e => setMapShowRadius(e.target.checked)} className="accent-blue-500" />{t.show} {t.visibilityRadius}</label>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4 text-xs">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#3b82f6' }}></div>{typeName('Billboard')}</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }}></div>{typeName('Banner')}</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }}></div>{typeName('Citylight')}</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#6b7280' }}></div>{t.booked}</div>
                  </div>
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl" style={{ height: '500px' }}><div ref={mapRef} style={{ width: '100%', height: '100%' }} /></div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold">{t.billboardAssets} ({mapFiltered.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {hasPermission('add') && <button onClick={() => { setEditingAsset(emptyAsset); setShowAddAsset(true); }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg flex items-center gap-2 text-sm shadow-lg magnetic-btn"><Plus className="w-4 h-4" />{t.addAsset}</button>}
                      {hasPermission('import_export') && <>
                        <button onClick={exportAssets} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg flex items-center gap-2 text-sm shadow-lg magnetic-btn"><Download className="w-4 h-4" />{t.export}</button>
                        <label className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg flex items-center gap-2 cursor-pointer text-sm shadow-lg magnetic-btn"><Upload className="w-4 h-4" />{t.import}<input type="file" accept=".json" onChange={importAssets} className="hidden" /></label>
                      </>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mapFiltered.map((m) => {
                      const firstImg = m.images?.[0];
                      const openInGallery = () => {
                        // Pick the brand of the first image (or general) and dive directly to this asset
                        const brand = firstImg?.brand || '__general__';
                        const imgs = (m.images || []).filter(im => (im.brand || '__general__') === brand).sort((x, y) => (y.campaignDate || y.date || '').localeCompare(x.campaignDate || x.date || ''));
                        setGalleryBrand(brand);
                        setGalleryAsset({ asset: m, images: imgs });
                        setView('gallery');
                      };
                      return (
                      <div key={m.id} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all hover:-translate-y-1 group h-full overflow-hidden">
                        {/* Thumbnail */}
                        <div className={`relative h-32 bg-slate-900 ${firstImg ? 'cursor-pointer' : ''}`} onClick={firstImg ? openInGallery : undefined}>
                          {firstImg ? (
                            <>
                              <img src={firstImg.url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                              {m.images.length > 1 && (
                                <div className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} px-2 py-1 bg-black/70 backdrop-blur rounded-md text-[10px] font-bold flex items-center gap-1`}>
                                  <Image className="w-3 h-3" />{m.images.length}
                                </div>
                              )}
                              <div className={`absolute bottom-2 ${dir === 'rtl' ? 'right-2' : 'left-2'} px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] font-semibold flex items-center gap-1 text-cyan-300`}>
                                <Image className="w-3 h-3" />{t.viewGallery}
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                              <Image className="w-10 h-10 mb-1" />
                              <span className="text-[10px]">{t.noImages}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="min-w-0">
                              <div className="font-semibold group-hover:text-blue-400 transition-colors truncate">{tName(m)}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-400"><MapPin className="w-3 h-3 text-cyan-400" /><span className="text-cyan-300 font-semibold">{cityName(m.city)}</span><span>·</span><span>{typeName(m.type)}</span></div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={() => setShowImageManager(m)} className="p-1 hover:bg-cyan-500/20 rounded text-cyan-400 relative" title={t.imageManager}><Upload className="w-4 h-4" />{m.images?.length > 0 && <span className={`absolute -top-1 ${dir === 'rtl' ? '-left-1' : '-right-1'} bg-cyan-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center`}>{m.images.length}</span>}</button>
                              <button onClick={() => setShowAssetHistory(m)} className="p-1 hover:bg-blue-500/20 rounded text-blue-400" title={t.history}><History className="w-4 h-4" /></button>
                              {hasPermission('edit') && <button onClick={() => { setEditingAsset(m); setShowEditAsset(true); }} className="p-1 hover:bg-orange-500/20 rounded text-orange-400" title={t.editAsset}><Edit className="w-4 h-4" /></button>}
                              {hasPermission('delete') && <button onClick={() => setConfirmDelete(m)} className="p-1 hover:bg-red-500/20 rounded text-red-400" title={t.delete}><Trash2 className="w-4 h-4" /></button>}
                            </div>
                          </div>
                          {m.brand && <div className="mb-2 px-2 py-1 bg-green-500/20 rounded text-xs text-green-300 border border-green-500/30">{t.current}: {m.brand}</div>}
                          <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30"><div className="text-gray-400">{t.traffic}</div><div className="font-bold text-blue-300">{(m.traffic / 1000).toFixed(0)}K</div></div>
                            <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30"><div className="text-gray-400">{t.visibilityRadius}</div><div className="font-bold text-amber-300">{m.detectionRadius}m → {dirLabel(m.geoDirection)}</div></div>
                            <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30"><div className="text-gray-400">{t.score}</div><div className="font-bold text-purple-300">{m.score}</div></div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          {/* ═══ NAVIGATION VIEW ═══ */}
          {view === 'navigation' && (
            <div className="space-y-6 animate-fade-in">
              <Reveal>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Navigation className="w-5 h-5 text-blue-400" />{t.routeVisibility}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                      <label className="text-sm mb-2 text-gray-300 flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">A</div>{t.origin}</label>
                      <div className="flex gap-2">
                        <input type="text" value={navOriginQuery} onChange={e => setNavOriginQuery(e.target.value)} placeholder={t.searchAddress} className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-blue-500" />
                        <button onClick={() => setNavPickMode(navPickMode === 'origin' ? null : 'origin')} className={`px-3 py-2 rounded-lg magnetic-btn ${navPickMode === 'origin' ? 'bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}><MapPin className="w-4 h-4" /></button>
                      </div>
                      {navOriginSuggestions.length > 0 && navOriginQuery !== navOrigin?.short && (<div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-white/20 rounded-lg shadow-2xl max-h-60 overflow-y-auto">{navOriginSuggestions.map((s, i) => <button key={i} onClick={() => { setNavOrigin(s); setNavOriginQuery(s.short); setNavOriginSuggestions([]); }} className="w-full text-start px-3 py-2 hover:bg-white/10 border-b border-white/5"><div className="text-sm font-semibold">{s.short}</div></button>)}</div>)}
                      {navOrigin && <div className="text-xs text-green-400 mt-1">{navOrigin.short}</div>}
                    </div>
                    <div className="relative">
                      <label className="text-sm mb-2 text-gray-300 flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">B</div>{t.destination}</label>
                      <div className="flex gap-2">
                        <input type="text" value={navDestQuery} onChange={e => setNavDestQuery(e.target.value)} placeholder={t.searchAddress} className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-blue-500" />
                        <button onClick={() => setNavPickMode(navPickMode === 'dest' ? null : 'dest')} className={`px-3 py-2 rounded-lg magnetic-btn ${navPickMode === 'dest' ? 'bg-red-600' : 'bg-white/10 hover:bg-white/20'}`}><MapPin className="w-4 h-4" /></button>
                      </div>
                      {navDestSuggestions.length > 0 && navDestQuery !== navDest?.short && (<div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-white/20 rounded-lg shadow-2xl max-h-60 overflow-y-auto">{navDestSuggestions.map((s, i) => <button key={i} onClick={() => { setNavDest(s); setNavDestQuery(s.short); setNavDestSuggestions([]); }} className="w-full text-start px-3 py-2 hover:bg-white/10 border-b border-white/5"><div className="text-sm font-semibold">{s.short}</div></button>)}</div>)}
                      {navDest && <div className="text-xs text-red-400 mt-1">{navDest.short}</div>}
                    </div>
                  </div>
                  {navPickMode && <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-300 flex items-center gap-2"><MapPin className="w-4 h-4" />{t.clickMapSet} {navPickMode === 'origin' ? t.setAsOrigin : t.setAsDest}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div><label className="text-sm mb-2 text-gray-300 block">{t.searchRadius}: <span className="text-blue-400 font-bold">{navVisibilityRadius}m</span></label><input type="range" min="50" max="2000" step="50" value={navVisibilityRadius} onChange={e => setNavVisibilityRadius(parseInt(e.target.value))} className="w-full accent-blue-500" /></div>
                    <div><label className="text-sm mb-2 text-gray-300 block">{t.avgSpeed}: <span className="text-green-400 font-bold">{navAvgSpeed} km/h</span></label><input type="range" min="20" max="120" step="5" value={navAvgSpeed} onChange={e => setNavAvgSpeed(parseInt(e.target.value))} className="w-full accent-green-500" /></div>
                    <div><label className="text-sm mb-2 text-gray-300 block flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" />{t.filterByCity}</label><select value={navCityFilter} onChange={e => setNavCityFilter(e.target.value)} className="w-full px-3 py-2 bg-slate-800 text-white border border-white/20 rounded-lg text-sm focus:border-blue-500"><option value="all">{t.allCities}</option>{CITY_LIST.map(c => <option key={c} value={c}>{cityName(c)}</option>)}</select></div>
                    <div className="flex items-end gap-2"><button onClick={() => { setNavOrigin(null); setNavDest(null); setNavOriginQuery(''); setNavDestQuery(''); setNavRoute(null); setNavCityFilter('all'); }} className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-sm border border-red-500/30 magnetic-btn">{t.reset}</button></div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={50}>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ height: '500px' }}>
                    <div ref={navMapRef} style={{ width: '100%', height: '100%' }} />
                    {navLoading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"><div className="bg-slate-900/95 px-6 py-4 rounded-xl border border-white/20 flex items-center gap-3"><div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div><span>{t.calculatingRoute}</span></div></div>}
                    {navError && <div className="absolute top-4 left-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm flex items-center gap-2 z-20"><AlertCircle className="w-4 h-4" />{navError}</div>}
                  </div>
                </div>
              </Reveal>
              {navRoute && (<Reveal delay={100}><div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-4 border border-blue-500/30"><div className="text-xs text-blue-200 mb-1 flex items-center gap-1"><Route className="w-3 h-3" />{t.distance}</div><div className="text-2xl font-bold text-blue-100">{(navRoute.distance / 1000).toFixed(1)} km</div></div>
                <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-4 border border-green-500/30"><div className="text-xs text-green-200 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration}</div><div className="text-2xl font-bold text-green-100">{Math.round(navRoute.duration / 60)} min</div></div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30"><div className="text-xs text-purple-200 mb-1 flex items-center gap-1"><Activity className="w-3 h-3" />{t.visibleBillboards}</div><div className="text-2xl font-bold text-purple-100">{routeVisibility.length}</div></div>
                <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-xl p-4 border border-orange-500/30"><div className="text-xs text-orange-200 mb-1 flex items-center gap-1"><Eye className="w-3 h-3" />{t.totalExposure}</div><div className="text-2xl font-bold text-orange-100">{routeVisibility.reduce((s, r) => s + r.viewSeconds, 0).toFixed(0)}s</div></div>
              </div></Reveal>)}
              {routeVisibility.length > 0 && (<Reveal delay={150}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Eye className="w-5 h-5 text-blue-400" />{t.billboardsAlongRoute} ({routeVisibility.length})</h3>
                  <button onClick={exportRouteCSV} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-sm font-semibold flex items-center gap-2 magnetic-btn"><Download className="w-4 h-4" />{t.exportFiltered}</button>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">{routeVisibility.map((rv, i) => {
                  const a = rv.asset; const sc = rv.visibilityScore > 70 ? 'green' : rv.visibilityScore > 40 ? 'yellow' : 'red';
                  const grad = { green: 'from-green-500/20 to-emerald-500/20 border-green-500/40', yellow: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/40', red: 'from-red-500/20 to-rose-500/20 border-red-500/40' }[sc];
                  const txt = { green: 'text-green-300', yellow: 'text-yellow-300', red: 'text-red-300' }[sc];
                  return (<div key={`${a.id}-${i}`} className={`bg-gradient-to-r ${grad} border rounded-xl p-4`}><div className="flex flex-col md:flex-row items-start md:items-center gap-4"><div className="flex items-center gap-3 flex-1"><div className={`w-12 h-12 rounded-full ${txt} bg-black/30 border-2 border-current flex items-center justify-center font-bold text-lg flex-shrink-0`}>{rv.visibilityScore}</div><div><div className="font-bold">{tName(a)}</div><div className="flex items-center gap-2 text-xs text-gray-400"><MapPin className="w-3 h-3 text-cyan-400" /><span className="text-cyan-300">{cityName(a.city)}</span><span>·</span><span style={{ color: TYPE_COLORS[a.type] }}>{typeName(a.type)}</span></div></div></div><div className="grid grid-cols-4 gap-3 w-full md:w-auto"><div className="text-center"><div className="text-xs text-gray-400">{t.atKm}</div><div className="font-bold text-blue-300">{(rv.distanceAlong / 1000).toFixed(1)}</div></div><div className="text-center"><div className="text-xs text-gray-400">{t.distance}</div><div className="font-bold text-cyan-300">{rv.distance}m</div></div><div className="text-center"><div className="text-xs text-gray-400">{t.viewTime}</div><div className="font-bold text-green-300">{rv.viewSeconds.toFixed(1)}s</div></div><div className="text-center"><div className="text-xs text-gray-400">{t.lanes}</div><div className="font-bold text-purple-300">{a.visibleFromLanes?.length}/{a.streetLanes}</div></div></div></div></div>);
                })}</div></div></Reveal>)}
              {navRoute && routeVisibility.length === 0 && (
                <Reveal delay={100}><div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl p-6 border border-orange-500/30 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-orange-400 opacity-70" />
                  <h3 className="text-lg font-semibold mb-2">{lang === 'fa' ? 'تابلویی در این مسیر پیدا نشد' : 'No billboards found along this route'}</h3>
                  <p className="text-sm text-gray-400 max-w-md mx-auto">{lang === 'fa' ? `حداکثر فاصله جستجو فعلی: ${navVisibilityRadius} متر. اسلایدر را افزایش دهید تا جستجو وسیع‌تر شود.` : `Current max search distance: ${navVisibilityRadius}m. Increase the slider to widen the search.`}</p>
                </div></Reveal>
              )}
              {!navRoute && !navOrigin && !navDest && (<Reveal delay={100}><div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/30 text-center"><Navigation className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-60" /><h3 className="text-xl font-semibold mb-2">{t.startRoute}</h3><p className="text-gray-400 max-w-md mx-auto">{t.findBillboards}</p></div></Reveal>)}
            </div>
          )}

          {/* ═══ BUDGET VIEW ═══ */}
          {view === 'budget' && hasPermission('optimize') && (
            <div className="space-y-6 animate-fade-in">
              <Reveal>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Target className="w-5 h-5 text-blue-400" />{t.budgetOptimizer}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setBudgetViewMode('grid')} className={`px-4 py-2 rounded-lg flex items-center gap-2 magnetic-btn ${budgetViewMode === 'grid' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}><BarChart3 className="w-4 h-4" />{t.select}</button>
                      <button onClick={() => setBudgetViewMode('city')} className={`px-4 py-2 rounded-lg flex items-center gap-2 magnetic-btn ${budgetViewMode === 'city' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}><Building2 className="w-4 h-4" />{t.cities}</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div><label className="block text-sm mb-2">{t.budgetMillion}</label><input type="number" value={budget / 1000000} onChange={e => setBudget(+e.target.value * 1000000)} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-500" /></div>
                    <div><label className="block text-sm mb-2">{t.usage}</label><div className="h-3 bg-white/10 rounded-full mt-2 overflow-hidden"><div className={`h-full rounded-full transition-all duration-700 ${totalCost > budget ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-blue-500'}`} style={{ width: `${Math.min((totalCost / budget) * 100, 100)}%` }} /></div><div className="text-xs text-gray-400 mt-1">{(totalCost / 1000000).toFixed(1)}M / {(budget / 1000000).toFixed(1)}M</div></div>
                    <div className="flex items-end"><button onClick={() => setShowOptimizationModal(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg magnetic-btn"><Zap className="w-4 h-4" />{t.autoOptimize}</button></div>
                  </div>
                  {selected.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[{ l: t.selected, v: selected.length, c: 'blue' }, { l: t.impMonth, v: `${(totalImp / 1000000).toFixed(1)}M`, c: 'green' }, { l: t.totalCost, v: `${(totalCost / 1000000).toFixed(1)}M`, c: 'purple' }, { l: t.avgCpm, v: totalImp > 0 ? ((totalCost / totalImp) * 1000).toFixed(0) : 0, c: 'orange' }].map(s => { const g = { blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30', green: 'from-green-600/20 to-green-800/20 border-green-500/30', purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30', orange: 'from-orange-600/20 to-orange-800/20 border-orange-500/30' }[s.c]; return <div key={s.l} className={`bg-gradient-to-br ${g} rounded-xl p-4 border`}><div className="text-sm opacity-80 mb-1">{s.l}</div><div className="text-2xl font-bold">{s.v}</div></div>; })}</div>)}
                </div>
              </Reveal>

              {budgetViewMode === 'city' && (
                <Reveal delay={100}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
                    <h3 className="text-lg font-semibold">{t.cityBudgetBreakdown}</h3>
                    <div><label className="text-xs text-gray-400 mr-2">{t.weeks}: <b className="text-blue-400">{budgetWeeks}</b></label><input type="range" min="1" max="12" value={budgetWeeks} onChange={e => setBudgetWeeks(+e.target.value)} className="accent-blue-500 w-40" /></div>
                  </div>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-white/20 text-gray-400"><th className="text-start p-3">{t.city}</th><th className="text-end p-3">{t.assets}</th><th className="text-end p-3">{t.cost} (M)</th><th className="text-center p-3">{t.inBudget}</th></tr></thead><tbody>{budgetByCity.map(row => (<tr key={row.city} className="border-b border-white/5 hover:bg-white/5"><td className="p-3 font-semibold text-cyan-300">{cityName(row.city)}</td><td className="p-3 text-end">{row.count}</td><td className="p-3 text-end text-green-400 font-bold">{(row.cost / 1000000).toFixed(0)}M</td><td className="p-3 text-center">{row.inBudget ? <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">✓ {t.yes}</span> : <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">✗ {t.no}</span>}</td></tr>))}</tbody></table></div>
                </div></Reveal>
              )}

              {budgetViewMode === 'grid' && (
                <Reveal delay={100}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">{t.availableManual}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Select label={t.filterByCity} icon={MapPin} value={budgetFilterCity} onChange={e => setBudgetFilterCity(e.target.value)}><option value="all">{t.allCities}</option>{uniqueCities.map(c => <option key={c} value={c}>{cityName(c)}</option>)}</Select>
                    <Select label={t.filterByType} icon={Filter} value={budgetFilterType} onChange={e => setBudgetFilterType(e.target.value)}><option value="all">{t.allTypes}</option><option value="Billboard">{typeName('Billboard')}</option><option value="Banner">{typeName('Banner')}</option><option value="Citylight">{typeName('Citylight')}</option></Select>
                    <Select label={t.sortBy} icon={TrendingUp} value={budgetSortBy} onChange={e => setBudgetSortBy(e.target.value)}><option value="score">{t.score} ↓</option><option value="price-low">{t.price} ↑</option><option value="price-high">{t.price} ↓</option><option value="traffic">{t.traffic} ↓</option><option value="cpm">CPM ↑</option></Select>
                  </div>
                  <div className="flex items-center justify-between mb-4"><div className="text-sm text-gray-400">{budgetFilteredAssets.length} {t.assetsShown}</div>{selected.length > 0 && <button onClick={() => setSelected([])} className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 text-sm border border-red-500/30 magnetic-btn">{t.clearAll}</button>}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{budgetFilteredAssets.map((m) => (<div key={m.id} onClick={() => toggle(m.id)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${selected.includes(m.id) ? 'bg-gradient-to-br from-green-600/30 to-emerald-600/30 border-green-500 shadow-lg shadow-green-500/20' : 'bg-white/5 border-white/10 hover:border-blue-500/50'}`}><div className="flex justify-between items-start mb-3"><div className="min-w-0"><div className="font-bold truncate">{tName(m)}</div><div className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3 text-cyan-400" />{cityName(m.city)} · {typeName(m.type)}</div></div>{selected.includes(m.id) ? <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-white" /></div> : <div className="w-6 h-6 border-2 border-white/30 rounded-full flex-shrink-0" />}</div><div className="grid grid-cols-2 gap-2 text-xs mb-2"><div className="bg-blue-500/20 p-2 rounded-lg"><div className="text-gray-400">{t.traffic}</div><div className="font-bold text-blue-300">{(m.traffic / 1000).toFixed(0)}K</div></div><div className="bg-green-500/20 p-2 rounded-lg"><div className="text-gray-400">{t.price}</div><div className="font-bold text-green-300">{(m.price / 1000000).toFixed(1)}M</div></div><div className="bg-purple-500/20 p-2 rounded-lg"><div className="text-gray-400">CPM</div><div className="font-bold text-purple-300">{m.cpm}</div></div><div className="bg-orange-500/20 p-2 rounded-lg"><div className="text-gray-400">{t.score}</div><div className="font-bold text-orange-300">{m.score}</div></div></div></div>))}</div>
                </div></Reveal>
              )}

              {selected.length > 0 && (<Reveal delay={150}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"><h3 className="text-lg font-semibold mb-4">{t.selectedBillboards} ({selected.length})</h3><div className="space-y-3">{selData.map(m => (<div key={m.id} className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div className="flex-1"><div className="font-semibold">{tName(m)}</div><div className="flex items-center gap-1 text-sm text-gray-400"><MapPin className="w-3 h-3 text-cyan-400" />{cityName(m.city)} · {typeName(m.type)}</div></div><div className="flex flex-wrap items-center gap-4"><div><div className="text-xs text-gray-400">{t.impMonth}</div><div className="font-bold text-green-400">{(m.monthly / 1000).toFixed(0)}K</div></div><div><div className="text-xs text-gray-400">{t.price}</div><div className="font-bold text-blue-400">{(m.price / 1000000).toFixed(1)}M</div></div><div><div className="text-xs text-gray-400">{t.score}</div><div className="font-bold text-orange-400">{m.score}</div></div><button onClick={() => toggle(m.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"><X className="w-4 h-4" /></button></div></div>))}</div></div></Reveal>)}
            </div>
          )}

          {/* ============ ANALYTICS VIEW ============ */}
          {view === 'analytics' && (() => {
            const allScores = anFiltered.map(m => calcAdvancedScore(m));
            const avgTotal = allScores.length ? allScores.reduce((s, a) => s + a.total, 0) / allScores.length : 0;
            const withIssues = allScores.filter(a => a.issues.length > 0).length;
            const highSev = allScores.filter(a => a.issues.some(i => i.severity === 'high')).length;
            const ranked = anFiltered.map((m, i) => ({ m, adv: allScores[i] }));
            const top = [...ranked].sort((a, b) => b.adv.total - a.adv.total).slice(0, 5);
            const bottom = [...ranked].sort((a, b) => a.adv.total - b.adv.total).slice(0, 5);
            return (
              <div className="space-y-6">
                <Reveal>
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                      <h2 className="text-xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-blue-400" />{t.analytics}</h2>
                      {hasPermission('import_export') && (
                        <button onClick={exportAnalyticsCSV} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-sm font-semibold flex items-center gap-2 magnetic-btn"><Download className="w-4 h-4" />{t.exportFiltered}</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select label={t.filterByCity} icon={MapPin} value={anFilterCity} onChange={e => setAnFilterCity(e.target.value)}><option value="all">{t.allCities}</option>{uniqueCities.map(c => <option key={c} value={c}>{cityName(c)}</option>)}</Select>
                      <Select label={t.filterByType} icon={Filter} value={anFilterType} onChange={e => setAnFilterType(e.target.value)}><option value="all">{t.allTypes}</option><option value="Billboard">{typeName('Billboard')}</option><option value="Banner">{typeName('Banner')}</option><option value="Citylight">{typeName('Citylight')}</option></Select>
                      <Select label={t.campaign} icon={Building2} value={anFilterCampaign} onChange={e => setAnFilterCampaign(e.target.value)}><option value="all">{t.allCampaigns}</option>{anCampaigns.map(c => <option key={c} value={c}>{c}</option>)}</Select>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">{t.minImpressions}: <b className="text-blue-400">{(anMinImp / 1000).toFixed(0)}K</b></label>
                        <input type="range" min="0" max="500000" step="10000" value={anMinImp} onChange={e => setAnMinImp(+e.target.value)} className="accent-blue-500 w-full mt-2" />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                      <span className="text-gray-400">{anFiltered.length} {t.assetsShown}</span>
                      <span className="px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30 text-xs">{t.avgScore}: <b className="text-blue-300">{avgTotal.toFixed(0)}</b></span>
                      <span className="px-3 py-1 bg-orange-500/20 rounded-lg border border-orange-500/30 text-xs">{t.withIssues}: <b className="text-orange-300">{withIssues}/{anFiltered.length}</b></span>
                      <span className="px-3 py-1 bg-red-500/20 rounded-lg border border-red-500/30 text-xs">{t.critical}: <b className="text-red-300">{highSev}</b></span>
                    </div>
                  </div>
                </Reveal>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: t.avgTraffic, v: `${(analytics.avg.traffic / 1000).toFixed(1)}K`, c: 'from-blue-600/20 to-blue-800/20 border-blue-500/30', ic: Activity },
                    { l: t.avgScore, v: analytics.avg.score.toFixed(0), c: 'from-orange-600/20 to-orange-800/20 border-orange-500/30', ic: Target },
                    { l: t.avgCpm, v: analytics.avg.cpm.toFixed(0), c: 'from-purple-600/20 to-purple-800/20 border-purple-500/30', ic: DollarSign },
                    { l: t.avgPrice, v: `${(analytics.avg.price / 1000000).toFixed(1)}M`, c: 'from-green-600/20 to-green-800/20 border-green-500/30', ic: TrendingUp }
                  ].map((s) => (
                    <div key={s.l} className={`bg-gradient-to-br ${s.c} rounded-xl p-4 border`}><s.ic className="w-5 h-5 mb-2 opacity-70" /><div className="text-xs opacity-80 mb-1">{s.l}</div><div className="text-2xl font-bold"><Counter value={parseFloat(s.v)} />{String(s.v).replace(/[0-9.]/g, '')}</div></div>
                  ))}
                </div>

                {/* Top performers & need attention */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Reveal>
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-400" />{t.topPerformers}</h3>
                      <div className="space-y-3">{top.map(({ m, adv }) => { const g = SCORE_GRADE(adv.total); return (
                        <div key={m.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => { setEditingAsset(m); setShowEditAsset(true); }}>
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: g.color + '33', color: g.color, border: `2px solid ${g.color}` }}>{g.label}</div>
                          <div className="flex-1 min-w-0"><div className="font-semibold truncate">{tName(m)}</div><div className="text-xs text-gray-400 flex items-center gap-2"><MapPin className="w-3 h-3 text-cyan-400" />{cityName(m.city)} · {typeName(m.type)}</div></div>
                          <div className="text-end"><div className="text-xl font-bold" style={{ color: g.color }}>{adv.total}</div><div className="text-xs text-gray-500">/100</div></div>
                        </div>
                      ); })}</div>
                    </div>
                  </Reveal>
                  <Reveal delay={80}>
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />{t.needAttention}</h3>
                      <div className="space-y-3">{bottom.map(({ m, adv }) => { const g = SCORE_GRADE(adv.total); return (
                        <div key={m.id} className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" onClick={() => { setEditingAsset(m); setShowEditAsset(true); }}>
                          <div className="flex items-center gap-3 mb-2"><div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: g.color + '33', color: g.color, border: `2px solid ${g.color}` }}>{g.label}</div><div className="flex-1 min-w-0"><div className="font-semibold truncate">{tName(m)}</div><div className="text-xs text-gray-400 flex items-center gap-2"><MapPin className="w-3 h-3 text-cyan-400" />{cityName(m.city)}</div></div><div className="text-xl font-bold" style={{ color: g.color }}>{adv.total}</div></div>
                          {adv.issues.length > 0 && <div className="text-xs space-y-1 ps-1">{adv.issues.slice(0, 2).map((iss, k) => (
                            <div key={k} className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${iss.severity === 'high' ? 'bg-red-400' : iss.severity === 'medium' ? 'bg-orange-400' : 'bg-yellow-400'}`}></div><span className="text-gray-300">{lang === 'fa' ? iss.titleFa : iss.titleEn}</span><span className="text-red-300 font-mono">{iss.impact}</span></div>
                          ))}</div>}
                        </div>
                      ); })}</div>
                    </div>
                  </Reveal>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Reveal><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">{t.cityPerformance}</h3>
                    <ResponsiveContainer width="100%" height={280}><BarChart data={analytics.cityMetrics}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" /><XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} /><YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} /><Legend /><Bar dataKey="count" name={t.assets} fill="#3b82f6" radius={[6, 6, 0, 0]} /><Bar dataKey="traffic" name={`${t.traffic} (K)`} fill="#10b981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
                  </div></Reveal>

                  <Reveal delay={80}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">{t.typeDistribution}</h3>
                    <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={analytics.byType.map(d => ({ ...d, name: typeName(d.name) }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>{analytics.byType.map((e, i) => <Cell key={i} fill={TYPE_COLORS[e.name] || CHART_COLORS[i % CHART_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} /></PieChart></ResponsiveContainer>
                  </div></Reveal>

                  <Reveal delay={120}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">{t.impVsCpm}</h3>
                    <ResponsiveContainer width="100%" height={280}><ScatterChart><CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" /><XAxis type="number" dataKey="x" name={t.monthlyImp} unit="K" tick={{ fill: '#cbd5e1', fontSize: 11 }} /><YAxis type="number" dataKey="y" name="CPM" tick={{ fill: '#cbd5e1', fontSize: 11 }} /><Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} /><Scatter data={scatterData} fill="#a855f7" /></ScatterChart></ResponsiveContainer>
                  </div></Reveal>

                  <Reveal delay={160}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">{t.bySize}</h3>
                    <ResponsiveContainer width="100%" height={280}><BarChart data={analytics.bySize} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" /><XAxis type="number" tick={{ fill: '#cbd5e1', fontSize: 11 }} /><YAxis type="category" dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} width={70} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} /><Bar dataKey="value" name={t.assets} fill="#06b6d4" radius={[0, 6, 6, 0]}>{analytics.bySize.map((e, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer>
                  </div></Reveal>
                </div>

                {/* Score breakdown table */}
                <Reveal><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" />{t.scoreBreakdown}</h3>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-white/20 text-gray-400"><th className="text-start p-2">{t.asset}</th><th className="text-start p-2">{t.city}</th><th className="text-center p-2">{t.grade}</th><th className="text-end p-2">{t.total}</th><th className="text-end p-2 text-blue-300">{t.physical}</th><th className="text-end p-2 text-purple-300">{t.visibility}</th><th className="text-end p-2 text-green-300">{t.traffic}</th><th className="text-end p-2 text-orange-300">{t.value}</th><th className="text-center p-2">{t.issues}</th></tr></thead><tbody>{ranked.sort((a,b)=>b.adv.total-a.adv.total).slice(0, 50).map(({ m, adv }) => { const g = SCORE_GRADE(adv.total); return (
                    <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => { setEditingAsset(m); setShowEditAsset(true); }}>
                      <td className="p-2 font-semibold whitespace-nowrap">{tName(m)}</td>
                      <td className="p-2 text-cyan-300">{cityName(m.city)}</td>
                      <td className="p-2 text-center"><span className="px-2 py-1 rounded font-bold text-xs" style={{ background: g.color + '33', color: g.color }}>{g.label}</span></td>
                      <td className="p-2 text-end font-bold" style={{ color: g.color }}>{adv.total}</td>
                      <td className="p-2 text-end text-blue-300">{adv.physical}</td>
                      <td className="p-2 text-end text-purple-300">{adv.visibility}</td>
                      <td className="p-2 text-end text-green-300">{adv.traffic}</td>
                      <td className="p-2 text-end text-orange-300">{adv.value}</td>
                      <td className="p-2 text-center">{adv.issues.length > 0 ? <span className="text-orange-300">{adv.issues.length}</span> : <span className="text-green-300">✓</span>}</td>
                    </tr>
                  ); })}</tbody></table></div>
                  {ranked.length > 50 && <div className="text-center text-sm text-gray-500 mt-3">+{ranked.length - 50} {t.records}</div>}
                </div></Reveal>
              </div>
            );
          })()}

          {/* ============ HISTORY VIEW ============ */}
          {view === 'history' && (
            <div className="space-y-6">
              <Reveal>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><History className="w-6 h-6 text-purple-400" />{t.screeningHistory}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <Select label={t.brand} icon={Building2} value={historyFilterBrand} onChange={e => setHistoryFilterBrand(e.target.value)}><option value="all">{t.allCampaigns}</option>{uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}</Select>
                    <Select label={t.filterByCity} icon={MapPin} value={historyFilterCity} onChange={e => setHistoryFilterCity(e.target.value)}><option value="all">{t.allCities}</option>{uniqueCities.map(c => <option key={c} value={c}>{cityName(c)}</option>)}</Select>
                    <Select label={t.filterByType} icon={Filter} value={historyFilterType} onChange={e => setHistoryFilterType(e.target.value)}><option value="all">{t.allTypes}</option><option value="Billboard">{typeName('Billboard')}</option><option value="Banner">{typeName('Banner')}</option><option value="Citylight">{typeName('Citylight')}</option></Select>
                    <div><label className="block text-xs text-gray-400 mb-1">{t.dateFrom}</label><input type="date" value={historyDateFrom} onChange={e => setHistoryDateFrom(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                    <div><label className="block text-xs text-gray-400 mb-1">{t.dateTo}</label><input type="date" value={historyDateTo} onChange={e => setHistoryDateTo(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-400">{filteredHistory.length} {t.records}</div>
                    <button onClick={() => { setHistoryFilterBrand('all'); setHistoryFilterCity('all'); setHistoryFilterType('all'); setHistoryDateFrom(''); setHistoryDateTo(''); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm border border-white/20 magnetic-btn">{t.clearFilters}</button>
                  </div>
                </div>
              </Reveal>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ l: t.totalCampaigns, v: allHistoryEntries.length, c: 'from-blue-600/20 to-blue-800/20 border-blue-500/30' }, { l: t.uniqueBrands, v: uniqueBrands.length, c: 'from-purple-600/20 to-purple-800/20 border-purple-500/30' }, { l: t.activeCampaigns, v: allHistoryEntries.filter(e => !e.endDate).length, c: 'from-green-600/20 to-green-800/20 border-green-500/30' }, { l: t.cities, v: new Set(allHistoryEntries.map(e => e.city)).size, c: 'from-orange-600/20 to-orange-800/20 border-orange-500/30' }].map((s, i) => (
                  <Reveal key={s.l} delay={i * 60}><div className={`bg-gradient-to-br ${s.c} rounded-xl p-4 border`}><div className="text-xs opacity-80 mb-1">{s.l}</div><div className="text-2xl font-bold"><Counter value={s.v} /></div></div></Reveal>
                ))}
              </div>

              {brandAnalytics.length > 0 && (
                <Reveal delay={80}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">{t.brandAnalysis}</h3>
                  <ResponsiveContainer width="100%" height={300}><BarChart data={brandAnalytics.slice(0, 10)}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" /><XAxis dataKey="brand" tick={{ fill: '#cbd5e1', fontSize: 11 }} angle={-20} textAnchor="end" height={60} /><YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} /><Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#fff' }} /><Legend /><Bar dataKey="campaigns" name={t.totalCampaigns} fill="#a855f7" radius={[6, 6, 0, 0]} /><Bar dataKey="assets" name={t.assets} fill="#3b82f6" radius={[6, 6, 0, 0]} /><Bar dataKey="active" name={t.active} fill="#10b981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
                </div></Reveal>
              )}

              <Reveal delay={120}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">{t.screeningHistory}</h3>
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-500"><History className="w-12 h-12 mx-auto mb-3 opacity-30" />{t.noRecords}</div>
                ) : (
                  <div className="space-y-3">{filteredHistory.slice(0, 100).map((e, i) => (
                    <div key={`${e.assetId}-${e.entryIdx}`} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center font-bold text-purple-300">{e.brand?.[0] || '?'}</div>
                        <div><div className="font-bold">{e.brand}</div><div className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3 text-cyan-400" />{lang === 'fa' ? (e.assetNameFa || e.assetName) : e.assetName} · {cityName(e.city)} · {typeName(e.assetType)}</div></div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-300"><Calendar className="w-4 h-4 text-blue-400" />{e.date}{e.endDate ? ` → ${e.endDate}` : ''}</div>
                        {e.endDate ? <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">{t.completed}</span> : <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">{t.ongoing}</span>}
                      </div>
                    </div>
                  ))}</div>
                )}
                {filteredHistory.length > 100 && <div className="text-center text-sm text-gray-500 mt-3">+{filteredHistory.length - 100} {t.records}</div>}
              </div></Reveal>
            </div>
          )}

          {/* ============ USERS VIEW ============ */}
          {/* ============ GALLERY VIEW (Brand → Asset → Images) ============ */}
          {view === 'gallery' && (
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <button onClick={() => { setGalleryBrand(null); setGalleryAsset(null); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${!galleryBrand ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>
                  <Image className="w-4 h-4" />{t.gallery}
                </button>
                {galleryBrand && <>
                  <span className="text-gray-600">{dir === 'rtl' ? '←' : '→'}</span>
                  <button onClick={() => setGalleryAsset(null)} className={`px-3 py-1.5 rounded-lg transition-all ${!galleryAsset ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}>
                    {galleryBrand === '__general__' ? t.generalGallery : galleryBrand}
                  </button>
                </>}
                {galleryAsset && <>
                  <span className="text-gray-600">{dir === 'rtl' ? '←' : '→'}</span>
                  <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30">{tName(galleryAsset.asset)}</span>
                </>}
              </div>

              {/* FILTERS — only at level 1 (brand list) */}
              {!galleryBrand && (() => {
                const activeCount = galleryFilterCities.length + galleryFilterBrands.length + (galleryDateFrom ? 1 : 0) + (galleryDateTo ? 1 : 0);
                const toggleCity = (c) => setGalleryFilterCities(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
                const toggleBrand = (b) => setGalleryFilterBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]);
                const clearAll = () => { setGalleryFilterCities([]); setGalleryFilterBrands([]); setGalleryDateFrom(''); setGalleryDateTo(''); };
                return (
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10">
                    <button onClick={() => setGalleryFilterOpen(!galleryFilterOpen)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">{t.filters}</span>
                        {activeCount > 0 && <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded-full text-xs font-bold">{activeCount} {t.activeFilters}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        {activeCount > 0 && <span onClick={(e) => { e.stopPropagation(); clearAll(); }} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs border border-red-500/30 cursor-pointer">{t.clearFilters}</span>}
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${galleryFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </button>
                    {galleryFilterOpen && (
                      <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* City multi-select */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" />{t.city}</label>
                          <div className="flex flex-wrap gap-1.5 p-2 bg-white/5 border border-white/10 rounded-lg min-h-[42px]">
                            {CITY_LIST.map(c => { const sel = galleryFilterCities.includes(c); return (
                              <button key={c} onClick={() => toggleCity(c)} className={`px-2.5 py-1 rounded-md text-xs border transition-all ${sel ? 'bg-cyan-500/30 border-cyan-500/50 text-cyan-200' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                {sel && <Check className="w-3 h-3 inline me-1" />}{cityName(c)}
                              </button>
                            ); })}
                          </div>
                        </div>
                        {/* Brand multi-select */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-purple-400" />{t.brand}</label>
                          <div className="flex flex-wrap gap-1.5 p-2 bg-white/5 border border-white/10 rounded-lg max-h-[120px] overflow-y-auto">
                            {allGalleryBrands.length === 0 ? <span className="text-xs text-gray-500 px-1">{t.noImages}</span> : allGalleryBrands.map(b => { const sel = galleryFilterBrands.includes(b); return (
                              <button key={b} onClick={() => toggleBrand(b)} className={`px-2.5 py-1 rounded-md text-xs border transition-all ${sel ? 'bg-purple-500/30 border-purple-500/50 text-purple-200' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                {sel && <Check className="w-3 h-3 inline me-1" />}{b === '__general__' ? t.generalGallery : b}
                              </button>
                            ); })}
                          </div>
                        </div>
                        {/* Date range */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-orange-400" />{t.filterByCampaignDate}</label>
                          <div className="space-y-2">
                            <input type="date" value={galleryDateFrom} onChange={e => setGalleryDateFrom(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500" placeholder={t.dateFrom} />
                            <input type="date" value={galleryDateTo} onChange={e => setGalleryDateTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500" placeholder={t.dateTo} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* LEVEL 1 — BRANDS */}
              {!galleryBrand && (
                galleryData.length === 0 ? (
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
                    <Image className="w-16 h-16 mx-auto mb-3 text-gray-600" />
                    <p className="text-gray-500">{t.noBrandImages}</p>
                  </div>
                ) : (
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-bold flex items-center gap-2"><Image className="w-6 h-6 text-blue-400" />{t.gallery}</h2>
                      <div className="text-sm text-gray-400">{galleryData.length} {lang === 'fa' ? 'برند' : 'brands'}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryData.map(b => {
                        // grab up to 3 sample images as preview tiles
                        const preview = b.assets.flatMap(a => a.images).slice(0, 3);
                        const isGeneral = b.brand === '__general__';
                        return (
                          <button key={b.brand} onClick={() => setGalleryBrand(b.brand)} className="group bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-blue-500/50 hover:-translate-y-1 transition-all overflow-hidden text-start">
                            <div className="h-36 relative bg-slate-900">
                              {preview.length > 0 ? (
                                <div className="absolute inset-0 grid grid-cols-3 gap-0.5">
                                  {preview.map((im, i) => <img key={i} src={im.url} alt="" className="w-full h-full object-cover" />)}
                                  {preview.length < 3 && Array.from({ length: 3 - preview.length }).map((_, i) => <div key={`pad-${i}`} className="bg-white/5" />)}
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center"><Image className="w-12 h-12 text-gray-700" /></div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>
                            <div className="p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${isGeneral ? 'bg-gray-500/30 text-gray-300' : 'bg-gradient-to-br from-blue-500/40 to-purple-500/40 text-blue-200'}`}>{isGeneral ? '—' : (b.brand[0] || '?')}</div>
                                <div className="font-bold flex-1 truncate group-hover:text-blue-300 transition-colors">{isGeneral ? t.generalGallery : b.brand}</div>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span>{b.totalImages} {t.images}</span>
                                <span>·</span>
                                <span>{b.assets.length} {t.assets}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )}

              {/* LEVEL 2 — ASSETS within selected brand */}
              {galleryBrand && !galleryAsset && (() => {
                const b = galleryData.find(x => x.brand === galleryBrand);
                if (!b) { setGalleryBrand(null); return null; }
                return (
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setGalleryBrand(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg">{dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}</button>
                        <div>
                          <h2 className="text-xl font-bold">{galleryBrand === '__general__' ? t.generalGallery : galleryBrand}</h2>
                          <div className="text-xs text-gray-400 mt-0.5">{b.totalImages} {t.images} · {b.assets.length} {t.assets}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {b.assets.map(({ asset, images: imgs }) => (
                        <button key={asset.id} onClick={() => setGalleryAsset({ asset, images: imgs })} className="group bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-purple-500/50 hover:-translate-y-1 transition-all overflow-hidden text-start">
                          <div className="h-32 relative bg-slate-900">
                            <img src={imgs[0].url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} px-2 py-1 bg-black/60 backdrop-blur rounded-md text-[10px] font-bold flex items-center gap-1`}>
                              <Image className="w-3 h-3" />{imgs.length}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="font-bold truncate group-hover:text-purple-300 transition-colors">{tName(asset)}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1"><MapPin className="w-3 h-3 text-cyan-400" /><span className="text-cyan-300">{cityName(asset.city)}</span><span>·</span><span>{typeName(asset.type)}</span></div>
                            {imgs[0].campaignDate && <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" />{imgs[0].campaignDate}</div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* LEVEL 3 — IMAGES of selected asset under selected brand */}
              {galleryBrand && galleryAsset && (
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setGalleryAsset(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg">{dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}</button>
                      <div>
                        <h2 className="text-xl font-bold">{tName(galleryAsset.asset)}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span className="text-cyan-300">{cityName(galleryAsset.asset.city)}</span>
                          <span>·</span>
                          <span>{typeName(galleryAsset.asset.type)}</span>
                          <span>·</span>
                          <span>{galleryAsset.images.length} {t.images}</span>
                        </div>
                      </div>
                    </div>
                    {hasPermission('edit') && (
                      <button onClick={() => setShowImageManager(galleryAsset.asset)} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-semibold flex items-center gap-2 magnetic-btn"><Upload className="w-4 h-4" />{t.manage}</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {galleryAsset.images.map((im, idx) => (
                      <div key={im.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5">
                        <img src={im.url} alt="" className="w-full h-40 object-cover cursor-pointer transition-transform group-hover:scale-105" onClick={() => setImageLightbox({ images: galleryAsset.images, index: idx })} />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent px-2.5 py-2 text-[11px] text-gray-200">
                          {im.campaignDate && <div className="font-semibold text-cyan-300 flex items-center gap-1"><Calendar className="w-3 h-3" />{im.campaignDate}</div>}
                          {im.notes && <div className="truncate opacity-80 mt-0.5">{im.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============ USERS VIEW ============ */}
          {view === 'users' && hasPermission('manage_users') && (
            <div className="space-y-6">
              <Reveal>
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-blue-400" />{t.userManagement}</h2>
                    <button onClick={() => { setEditingUser(null); setNewUser({ username: '', password: '', name: '', role: 'viewer', permissions: ['view'] }); setShowUserModal(true); }} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold flex items-center gap-2 magnetic-btn"><Plus className="w-4 h-4" />{t.addUser}</button>
                  </div>
                  <div className="space-y-3">{users.map(u => (
                    <div key={u.id} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">{u.name?.[0] || u.username[0]}</div>
                        <div>
                          <div className="font-bold flex items-center gap-2">{u.name} {u.id === user.id && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">{lang === 'fa' ? 'شما' : 'You'}</span>}</div>
                          <div className="text-xs text-gray-400">@{u.username} · <span className="text-cyan-300">{t[u.role] || u.role}</span></div>
                          <div className="flex flex-wrap gap-1 mt-1">{u.permissions.map(p => { const pm = allPermissions.find(x => x.id === p); return <span key={p} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-gray-300">{pm?.name || p}</span>; })}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingUser({ ...u }); setShowUserModal(true); }} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300"><Edit className="w-4 h-4" /></button>
                        {u.id !== user.id && <button onClick={() => deleteUser(u.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    </div>
                  ))}</div>
                </div>
              </Reveal>

              <Reveal delay={80}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" />{t.permissionGuide}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{allPermissions.map(p => (
                  <div key={p.id} className="p-3 bg-white/5 rounded-lg border border-white/10"><div className="font-semibold text-sm text-blue-300">{p.name}</div><div className="text-xs text-gray-400">{p.desc}</div></div>
                ))}</div>
              </div></Reveal>
            </div>
          )}

          {/* ============ ABOUT VIEW ============ */}
          {view === 'about' && (
            <div className="space-y-6">
              <Reveal>
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl p-8 md:p-12 border border-white/10 text-center">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center mb-4"><Target className="w-10 h-10" /></div>
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">{t.appName}</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">{t.aboutHero1}</p>
                    <p className="text-base text-gray-400 max-w-2xl mx-auto mt-2">{t.aboutHero2}</p>
                    <button onClick={() => setView('map')} className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold flex items-center gap-2 mx-auto magnetic-btn"><MapPin className="w-5 h-5" />{t.exploreMap}</button>
                  </div>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{ ic: MapPin, t: t.interactiveMap, c: 'from-blue-500 to-cyan-500' }, { ic: Navigation, t: t.routeVisibility, c: 'from-green-500 to-emerald-500' }, { ic: Image, t: t.gallery, c: 'from-purple-500 to-pink-500' }, { ic: DollarSign, t: t.budgetOptimizer, c: 'from-orange-500 to-red-500' }, { ic: BarChart3, t: t.analytics, c: 'from-cyan-500 to-blue-500' }, { ic: History, t: t.screeningHistory, c: 'from-pink-500 to-purple-500' }].map((f, i) => (
                  <Reveal key={i} delay={i * 60}><div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:-translate-y-1 transition-transform h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.c} flex items-center justify-center mb-3`}><f.ic className="w-6 h-6" /></div>
                    <h3 className="font-bold text-lg">{f.t}</h3>
                  </div></Reveal>
                ))}
              </div>

              <Reveal delay={100}><div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ l: t.totalAssets, v: assets.length }, { l: t.cities, v: uniqueCities.length }, { l: t.uniqueBrands, v: uniqueBrands.length }, { l: t.totalCampaigns, v: allHistoryEntries.length }].map((s, i) => (
                  <div key={s.l} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-5 border border-white/10 text-center"><div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"><Counter value={s.v} /></div><div className="text-sm text-gray-400 mt-1">{s.l}</div></div>
                ))}
              </div></Reveal>
            </div>
          )}
        </div>
        </main>

        {/* ============ MODALS ============ */}
        {/* ---- USER MODAL ---- */}
        {showUserModal && (() => { const isEdit = !!editingUser; const u = isEdit ? editingUser : newUser; const set = (patch) => isEdit ? setEditingUser({ ...editingUser, ...patch }) : setNewUser({ ...newUser, ...patch });
          return (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowUserModal(false)}>
            <div dir={dir} className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" />{isEdit ? t.editUser : t.addUser}</h3><button onClick={() => setShowUserModal(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div><label className="block text-xs text-gray-400 mb-1">{t.fullName}</label><input value={u.name} onChange={e => set({ name: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.username}</label><input value={u.username} onChange={e => set({ username: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.password}</label><input value={u.password} onChange={e => set({ password: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.role}</label><select value={u.role} onChange={e => set({ role: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"><option value="admin" className="bg-slate-800">{t.admin}</option><option value="manager" className="bg-slate-800">{t.manager}</option><option value="viewer" className="bg-slate-800">{t.viewer}</option></select></div>
                <div><label className="block text-xs text-gray-400 mb-2">{t.permissions}</label><div className="grid grid-cols-1 gap-2">{allPermissions.map(p => (<label key={p.id} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"><input type="checkbox" checked={u.permissions.includes(p.id)} onChange={() => togglePermission(p.id, isEdit)} className="mt-1 accent-blue-500" /><div><div className="text-sm font-medium">{p.name}</div><div className="text-xs text-gray-400">{p.desc}</div></div></label>))}</div></div>
              </div>
              <div className="flex gap-3 mt-5"><button onClick={saveUser} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold flex items-center justify-center gap-2 magnetic-btn"><Save className="w-4 h-4" />{t.saveChanges}</button><button onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">{t.cancel}</button></div>
            </div>
          </div>
        ); })()}

        {/* ---- EDIT / ADD ASSET MODAL ---- */}
        {(showEditAsset || showAddAsset) && editingAsset && (() => { const isAdd = showAddAsset; const a = editingAsset; const set = (patch) => setEditingAsset({ ...editingAsset, ...patch });
          const num = (k, v) => set({ [k]: v === '' ? '' : +v });
          return (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { isAdd ? setShowAddAsset(false) : setShowEditAsset(false); setEditingAsset(null); }}>
            <div dir={dir} className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2"><Edit className="w-5 h-5 text-blue-400" />{isAdd ? t.addNewAsset : t.editAsset}</h3><button onClick={() => { isAdd ? setShowAddAsset(false) : setShowEditAsset(false); setEditingAsset(null); }} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="block text-xs text-gray-400 mb-1">{t.assetName} (EN)</label><input value={a.name || ''} onChange={e => set({ name: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.assetName} (FA)</label><input value={a.nameFa || ''} onChange={e => set({ nameFa: e.target.value })} dir="rtl" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.type}</label><select value={a.type} onChange={e => set({ type: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"><option value="Billboard" className="bg-slate-800">{typeName('Billboard')}</option><option value="Banner" className="bg-slate-800">{typeName('Banner')}</option><option value="Citylight" className="bg-slate-800">{typeName('Citylight')}</option></select></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.city}</label><select value={a.city} onChange={e => set({ city: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none">{CITY_LIST.map(c => <option key={c} value={c} className="bg-slate-800">{cityName(c)}</option>)}</select></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.size}</label><select value={a.size} onChange={e => set({ size: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"><option value="Small" className="bg-slate-800">{t.small}</option><option value="Medium" className="bg-slate-800">{t.medium}</option><option value="Large" className="bg-slate-800">{t.large}</option><option value="XLarge" className="bg-slate-800">{t.xlarge}</option></select></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.status}</label><select value={a.status} onChange={e => set({ status: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"><option value="available" className="bg-slate-800">{t.available}</option><option value="booked" className="bg-slate-800">{t.booked}</option></select></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.latitude}</label><input type="number" step="0.0001" value={a.lat} onChange={e => num('lat', e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.longitude}</label><input type="number" step="0.0001" value={a.lng} onChange={e => num('lng', e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.height} (m)</label><input type="number" step="0.1" value={a.height} onChange={e => num('height', e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.width} (m)</label><input type="number" step="0.1" value={a.width || ''} onChange={e => num('width', e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.structureHeight} (m)</label><input type="number" step="0.1" value={a.structureHeight || ''} onChange={e => num('structureHeight', e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.dailyTraffic}</label><input type="number" value={a.traffic} onChange={e => num('traffic', e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.monthlyPrice}</label><input type="number" value={a.price} onChange={e => num('price', e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.agency}</label><input value={a.agency || ''} onChange={e => set({ agency: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.currentBrand}</label><input list="brandlist-edit" value={a.brand || ''} onChange={e => set({ brand: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="-" /><datalist id="brandlist-edit">{CAMPAIGN_BRANDS.map(b => <option key={b} value={b} />)}</datalist></div>
                <div><label className="block text-xs text-gray-400 mb-1">Image Code</label><input value={a.imageCode || ''} onChange={e => set({ imageCode: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" placeholder="UMI-0001" /></div>
              </div>

              <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2"><Eye className="w-4 h-4" />{t.visibility} / {t.routeVisibility}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div><label className="block text-xs text-gray-400 mb-1">{t.detectionRadius} (m)</label><input type="number" value={a.detectionRadius} onChange={e => num('detectionRadius', e.target.value)} className="w-full bg-white/10 border border-blue-500/30 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                  <div><label className="block text-xs text-gray-400 mb-1">{t.facingDir}</label><select value={a.geoDirection || 'North'} onChange={e => set({ geoDirection: e.target.value })} className="w-full bg-white/10 border border-blue-500/30 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none">{['North','Northeast','East','Southeast','South','Southwest','West','Northwest'].map(d => <option key={d} value={d} className="bg-slate-800">{dirLabel(d)}</option>)}</select></div>
                  <div><label className="block text-xs text-gray-400 mb-1">{t.avgSpeedField}</label><input type="number" value={a.avgSpeed} onChange={e => num('avgSpeed', e.target.value)} className="w-full bg-white/10 border border-blue-500/30 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                  <div><label className="block text-xs text-gray-400 mb-1">{t.avgViewSec}</label><input type="number" step="0.1" value={a.avgViewTime} onChange={e => num('avgViewTime', e.target.value)} className="w-full bg-white/10 border border-blue-500/30 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div><label className="block text-xs text-gray-400 mb-1">{lang === 'fa' ? 'زاویه‌ی تابلو' : 'Board Angle'}</label><select value={a.boardAngle || 'Direct'} onChange={e => set({ boardAngle: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"><option value="Direct" className="bg-slate-800">{t.direct}</option><option value="Angled" className="bg-slate-800">{t.angled}</option></select></div>
                  <div><label className="block text-xs text-gray-400 mb-1">{t.direction}</label><select value={a.direction} onChange={e => set({ direction: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"><option value="Inbound" className="bg-slate-800">{t.inbound}</option><option value="Outbound" className="bg-slate-800">{t.outbound}</option></select></div>
                  <div><label className="block text-xs text-gray-400 mb-1">{t.lighting}</label><select value={a.hasLight} onChange={e => set({ hasLight: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"><option value="Yes" className="bg-slate-800">{t.lit}</option><option value="No" className="bg-slate-800">{t.no}</option></select></div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <h4 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">{lang === 'fa' ? 'خیابان و لاین‌ها' : 'Street & Lanes'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="block text-xs text-gray-400 mb-1">{t.numberOfLanes}</label><input type="number" min="1" max="8" value={a.streetLanes || 2} onChange={e => { const lanes = Math.max(1, Math.min(8, +e.target.value || 1)); set({ streetLanes: lanes, visibleFromLanes: (a.visibleFromLanes || []).filter(l => l <= lanes), obstacleAffectsLanes: (a.obstacleAffectsLanes || []).filter(l => l <= lanes) }); }} className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none" /></div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{t.visibleFromLanes}</label>
                    <div className="flex flex-wrap gap-2">{Array.from({ length: a.streetLanes || 2 }, (_, i) => i + 1).map(L => { const sel = (a.visibleFromLanes || []).includes(L); return (<button key={L} type="button" onClick={() => { const cur = a.visibleFromLanes || []; set({ visibleFromLanes: sel ? cur.filter(x => x !== L) : [...cur, L].sort() }); }} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${sel ? 'bg-purple-500/30 border-purple-500 text-purple-200' : 'bg-white/5 border-white/20 text-gray-400'}`}>{lang === 'fa' ? 'لاین' : 'Lane'} {L}</button>); })}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <h4 className="text-sm font-bold text-orange-300 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{t.hasObstacle}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><label className="block text-xs text-gray-400 mb-1">{t.obstacle}</label><select value={a.obstruction || 'None'} onChange={e => { const v = e.target.value; set({ obstruction: v, hasObstacle: v !== 'None' }); }} className="w-full bg-white/10 border border-orange-500/30 rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none"><option value="None" className="bg-slate-800">{t.none}</option><option value="Tree" className="bg-slate-800">{t.tree}</option><option value="Building" className="bg-slate-800">{lang === 'fa' ? 'ساختمان' : 'Building'}</option><option value="Traffic Sign" className="bg-slate-800">{t.trafficSign}</option></select></div>
                  <div><label className="block text-xs text-gray-400 mb-1">{t.obstacleCoverage} (%)</label><input type="number" min="0" max="100" value={a.obstaclePercent || 0} onChange={e => num('obstaclePercent', e.target.value)} disabled={!a.hasObstacle} className="w-full bg-white/10 border border-orange-500/30 rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none disabled:opacity-40" /></div>
                  <div className="flex items-end"><label className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/20 cursor-pointer w-full"><input type="checkbox" checked={!!a.obstacleRemovable} onChange={e => set({ obstacleRemovable: e.target.checked })} disabled={!a.hasObstacle} className="accent-orange-500" /><span className="text-xs">{t.obstacleRemovable}</span></label></div>
                </div>
                {a.hasObstacle && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">{t.obstacleAffects}</label>
                    <div className="flex flex-wrap gap-2">{Array.from({ length: a.streetLanes || 2 }, (_, i) => i + 1).map(L => { const sel = (a.obstacleAffectsLanes || []).includes(L); return (<button key={L} type="button" onClick={() => { const cur = a.obstacleAffectsLanes || []; set({ obstacleAffectsLanes: sel ? cur.filter(x => x !== L) : [...cur, L].sort() }); }} className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${sel ? 'bg-orange-500/30 border-orange-500 text-orange-200' : 'bg-white/5 border-white/20 text-gray-400'}`}>{lang === 'fa' ? 'لاین' : 'Lane'} {L}</button>); })}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-5"><button onClick={isAdd ? addAsset : saveAsset} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold flex items-center justify-center gap-2 magnetic-btn"><Save className="w-4 h-4" />{isAdd ? t.createAsset : t.saveChanges}</button><button onClick={() => { isAdd ? setShowAddAsset(false) : setShowEditAsset(false); setEditingAsset(null); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">{t.cancel}</button></div>
            </div>
          </div>
        ); })()}

        {/* ---- DELETE CONFIRM ---- */}
        {confirmDelete && (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
            <div dir={dir} className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-7 h-7 text-red-400" /></div>
              <h3 className="text-lg font-bold text-center mb-2">{t.deleteConfirm}</h3>
              <p className="text-center text-gray-400 text-sm mb-5">{tName(confirmDelete)}</p>
              <div className="flex gap-3"><button onClick={() => deleteAsset(confirmDelete.id)} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold magnetic-btn">{t.delete}</button><button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">{t.cancel}</button></div>
            </div>
          </div>
        )}

        {/* ---- ADD BRAND / CAMPAIGN MODAL ---- */}
        {showAddBrand && (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setShowAddBrand(null); setNewBrand({ brand: '', date: '', endDate: '' }); }}>
            <div dir={dir} className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-green-400" />{t.addCampaign}</h3><button onClick={() => { setShowAddBrand(null); setNewBrand({ brand: '', date: '', endDate: '' }); }} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button></div>
              <p className="text-sm text-gray-400 mb-3">{tName(showAddBrand)}</p>
              <div className="space-y-3">
                <div><label className="block text-xs text-gray-400 mb-1">{t.brandName}</label><input list="brandlist" value={newBrand.brand} onChange={e => setNewBrand({ ...newBrand, brand: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /><datalist id="brandlist">{CAMPAIGN_BRANDS.map(b => <option key={b} value={b} />)}</datalist></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.startDate}</label><input type="date" value={newBrand.date} onChange={e => setNewBrand({ ...newBrand, date: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">{t.endDate} <span className="text-gray-600">({t.endDateEmpty})</span></label><input type="date" value={newBrand.endDate} onChange={e => setNewBrand({ ...newBrand, endDate: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" /></div>
              </div>
              <div className="flex gap-3 mt-5"><button onClick={addBrandToHistory} className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold magnetic-btn">{t.addCampaign}</button><button onClick={() => { setShowAddBrand(null); setNewBrand({ brand: '', date: '', endDate: '' }); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">{t.cancel}</button></div>
            </div>
          </div>
        )}

        {/* ---- ASSET HISTORY MODAL ---- */}
        {showAssetHistory && (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAssetHistory(null)}>
            <div dir={dir} className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2"><History className="w-5 h-5 text-purple-400" />{t.history} — {tName(showAssetHistory)}</h3><button onClick={() => setShowAssetHistory(null)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button></div>
              {(showAssetHistory.brandHistory || []).length === 0 ? <div className="text-center py-8 text-gray-500">{t.noRecords}</div> : (
                <div className="space-y-2">{(showAssetHistory.brandHistory || []).map((h, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div><div className="font-semibold">{h.brand}</div><div className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{h.date}{h.endDate ? ` → ${h.endDate}` : ` · ${t.ongoing}`}</div></div>
                    {hasPermission('edit') && <button onClick={() => { removeBrandFromHistory(showAssetHistory.id, i); setShowAssetHistory({ ...showAssetHistory, brandHistory: showAssetHistory.brandHistory.filter((_, idx) => idx !== i) }); }} className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}</div>
              )}
              {hasPermission('edit') && <button onClick={() => { setShowAddBrand(showAssetHistory); setShowAssetHistory(null); }} className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold flex items-center justify-center gap-2 magnetic-btn"><Plus className="w-4 h-4" />{t.addCampaign}</button>}
            </div>
          </div>
        )}

        {/* ---- IMAGE MANAGER MODAL ---- */}
        {showImageManager && (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowImageManager(null)}>
            <div dir={dir} className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2"><Upload className="w-5 h-5 text-cyan-400" />{t.imageManager} — {tName(showImageManager)}</h3><button onClick={() => setShowImageManager(null)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button></div>
              {hasPermission('edit') && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    <input placeholder={t.brand} value={imageUploadMeta.brand} onChange={e => setImageUploadMeta({ ...imageUploadMeta, brand: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    <input type="date" value={imageUploadMeta.campaignDate} onChange={e => setImageUploadMeta({ ...imageUploadMeta, campaignDate: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                    <input placeholder={t.notes || 'Notes'} value={imageUploadMeta.notes} onChange={e => setImageUploadMeta({ ...imageUploadMeta, notes: e.target.value })} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold cursor-pointer magnetic-btn"><Upload className="w-4 h-4" />{t.uploadImages}<input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(showImageManager.id, e.target.files)} /></label>
                </div>
              )}
              {(() => { const cur = assets.find(x => x.id === showImageManager.id) || showImageManager; const imgs = cur.images || [];
                if (imgs.length === 0) return <div className="text-center py-8 text-gray-500">{t.noImages}</div>;
                // Group by brand → campaign
                const groups = {};
                imgs.forEach(im => { const key = im.brand || '__general__'; if (!groups[key]) groups[key] = []; groups[key].push(im); });
                const order = Object.keys(groups).sort((a, b) => a === '__general__' ? 1 : b === '__general__' ? -1 : a.localeCompare(b));
                return (
                  <div className="space-y-5">{order.map(k => {
                    const groupImgs = groups[k].sort((a, b) => (b.campaignDate || b.date || '').localeCompare(a.campaignDate || a.date || ''));
                    const isGeneral = k === '__general__';
                    return (
                      <div key={k}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${isGeneral ? 'bg-gray-500/30 text-gray-300' : 'bg-gradient-to-br from-blue-500/40 to-purple-500/40 text-blue-200'}`}>{isGeneral ? '—' : (k[0] || '?')}</div>
                          <div className="font-bold text-sm">{isGeneral ? t.generalGallery : k}</div>
                          <div className="text-xs text-gray-500">({groupImgs.length})</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{groupImgs.map((im, idx) => (
                          <div key={im.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5">
                            <img src={im.url} alt="" className="w-full h-32 object-cover cursor-pointer" onClick={() => setImageLightbox({ images: groupImgs, index: idx })} />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent px-2 py-1.5 text-[10px] text-gray-200">
                              {im.campaignDate && <div className="font-semibold text-cyan-300">{im.campaignDate}</div>}
                              {im.notes && <div className="truncate opacity-80">{im.notes}</div>}
                            </div>
                            {hasPermission('edit') && <button onClick={(ev) => { ev.stopPropagation(); removeImageFromAsset(showImageManager.id, im.id); }} className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} p-1.5 bg-red-600/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`}><Trash2 className="w-4 h-4" /></button>}
                          </div>
                        ))}</div>
                      </div>
                    );
                  })}</div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ---- IMPORT / EXPORT MODAL ---- */}
        {showImportExport && (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowImportExport(false)}>
            <div dir={dir} className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2"><Download className="w-5 h-5 text-blue-400" />{t.importExport}</h3><button onClick={() => setShowImportExport(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <button onClick={exportAssets} className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold flex items-center justify-center gap-2 magnetic-btn"><Download className="w-4 h-4" />{t.exportJson}</button>
                <label className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer magnetic-btn"><Upload className="w-4 h-4" />{t.importJson}<input type="file" accept="application/json" className="hidden" onChange={importAssets} /></label>
              </div>
            </div>
          </div>
        )}

        {/* ---- OPTIMIZATION MODAL ---- */}
        {showOptimizationModal && (
          <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowOptimizationModal(false)}>
            <div dir={dir} className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />{t.autoOptimization}</h3><button onClick={() => setShowOptimizationModal(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button></div>
              <div className="space-y-2 mb-4">{[{ id: 'quantity', n: t.maxQuantity, d: t.maxQuantityD }, { id: 'view', n: t.maxViews, d: t.maxViewsD }, { id: 'coverage', n: t.bestCoverage, d: t.bestCoverageD }, { id: 'type', n: t.balancedTypes, d: t.balancedTypesD }, { id: 'mixed', n: t.customMixed, d: t.customMixedD }].map(s => (
                <label key={s.id} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${optimizationStrategy === s.id ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><input type="radio" checked={optimizationStrategy === s.id} onChange={() => setOptimizationStrategy(s.id)} className="mt-1 accent-blue-500" /><div><div className="font-semibold text-sm">{s.n}</div><div className="text-xs text-gray-400">{s.d}</div></div></label>
              ))}</div>
              {optimizationStrategy === 'mixed' && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4 space-y-3">
                  <div className="text-sm font-semibold mb-1">{t.adjustWeights}</div>
                  {[{ k: 'quantity', l: t.quantity }, { k: 'view', l: t.views }, { k: 'coverage', l: t.coverage }].map(w => (
                    <div key={w.k}><label className="flex justify-between text-xs text-gray-400 mb-1"><span>{w.l}</span><b className="text-blue-400">{optimizationWeights[w.k]}%</b></label><input type="range" min="0" max="100" value={optimizationWeights[w.k]} onChange={e => setOptimizationWeights({ ...optimizationWeights, [w.k]: +e.target.value })} className="accent-blue-500 w-full" /></div>
                  ))}
                </div>
              )}
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4 text-sm flex justify-between"><span className="text-gray-400">{t.budget}</span><b className="text-green-400">{(budget / 1000000).toFixed(0)}M</b></div>
              <button onClick={optimize} disabled={isLoading} className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-bold flex items-center justify-center gap-2 magnetic-btn disabled:opacity-50">{isLoading ? <><Activity className="w-4 h-4 animate-spin" />{t.optimizing}</> : <><Play className="w-4 h-4" />{t.runOptimization}</>}</button>
            </div>
          </div>
        )}
      </div>
    );
}
