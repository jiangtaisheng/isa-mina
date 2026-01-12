/**
 * 图标和资源生成脚本
 * 生成 TabBar 图标、首页图标和轮播图占位图
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 输出目录
const tabbarDir = path.join(__dirname, '../src/assets/tabbar');
const iconsDir = path.join(__dirname, '../src/assets/icons');
const bannerDir = path.join(__dirname, '../src/assets/banner');

// 确保目录存在
[tabbarDir, iconsDir, bannerDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// TabBar 图标定义 (81x81 尺寸)
const tabbarIcons = {
  home: {
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
  },
  task: {
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
  },
  tools: {
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
  },
  mine: {
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
  }
};

// 首页功能图标 (96x96 尺寸，白色图标用于渐变背景)
const featureIcons = {
  album: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  invite: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
  history: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
};

// 轮播图 SVG (750x360 尺寸)
const bannerSvgs = {
  banner1: `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="360" viewBox="0 0 750 360">
    <defs>
      <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea"/>
        <stop offset="100%" style="stop-color:#764ba2"/>
      </linearGradient>
    </defs>
    <rect width="750" height="360" fill="url(#bg1)"/>
    <text x="375" y="150" text-anchor="middle" fill="#ffffff" font-size="48" font-weight="bold" font-family="Arial, sans-serif">一键去水印</text>
    <text x="375" y="210" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="28" font-family="Arial, sans-serif">支持图片和视频，快速高效</text>
    <circle cx="375" cy="280" r="30" fill="rgba(255,255,255,0.2)"/>
    <path d="M365 280 L385 280 M375 270 L375 290" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  banner2: `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="360" viewBox="0 0 750 360">
    <defs>
      <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f093fb"/>
        <stop offset="100%" style="stop-color:#f5576c"/>
      </linearGradient>
    </defs>
    <rect width="750" height="360" fill="url(#bg2)"/>
    <text x="375" y="150" text-anchor="middle" fill="#ffffff" font-size="48" font-weight="bold" font-family="Arial, sans-serif">多平台支持</text>
    <text x="375" y="210" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="28" font-family="Arial, sans-serif">抖音、快手、小红书等平台</text>
    <circle cx="300" cy="280" r="20" fill="rgba(255,255,255,0.2)"/>
    <circle cx="375" cy="280" r="20" fill="rgba(255,255,255,0.2)"/>
    <circle cx="450" cy="280" r="20" fill="rgba(255,255,255,0.2)"/>
  </svg>`,
  banner3: `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="360" viewBox="0 0 750 360">
    <defs>
      <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4facfe"/>
        <stop offset="100%" style="stop-color:#00f2fe"/>
      </linearGradient>
    </defs>
    <rect width="750" height="360" fill="url(#bg3)"/>
    <text x="375" y="150" text-anchor="middle" fill="#ffffff" font-size="48" font-weight="bold" font-family="Arial, sans-serif">完全免费</text>
    <text x="375" y="210" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="28" font-family="Arial, sans-serif">无需付费，无限次使用</text>
    <text x="375" y="280" text-anchor="middle" fill="#ffffff" font-size="64" font-family="Arial, sans-serif">¥0</text>
  </svg>`
};

async function generateAll() {
  const promises = [];

  // 生成 TabBar 图标
  console.log('Generating TabBar icons...');
  for (const [name, { default: defaultSvg, active: activeSvg }] of Object.entries(tabbarIcons)) {
    promises.push(
      sharp(Buffer.from(defaultSvg))
        .resize(81, 81)
        .png()
        .toFile(path.join(tabbarDir, `${name}.png`))
        .then(() => console.log(`  TabBar: ${name}.png`))
    );
    promises.push(
      sharp(Buffer.from(activeSvg))
        .resize(81, 81)
        .png()
        .toFile(path.join(tabbarDir, `${name}-active.png`))
        .then(() => console.log(`  TabBar: ${name}-active.png`))
    );
  }

  // 生成首页功能图标
  console.log('Generating feature icons...');
  for (const [name, svg] of Object.entries(featureIcons)) {
    promises.push(
      sharp(Buffer.from(svg))
        .resize(96, 96)
        .png()
        .toFile(path.join(iconsDir, `${name}.png`))
        .then(() => console.log(`  Icon: ${name}.png`))
    );
  }

  // 生成轮播图
  console.log('Generating banners...');
  for (const [name, svg] of Object.entries(bannerSvgs)) {
    promises.push(
      sharp(Buffer.from(svg))
        .resize(750, 360)
        .png()
        .toFile(path.join(bannerDir, `${name}.png`))
        .then(() => console.log(`  Banner: ${name}.png`))
    );
  }

  await Promise.all(promises);
  console.log('\nAll assets generated successfully!');
}

generateAll().catch(console.error);
