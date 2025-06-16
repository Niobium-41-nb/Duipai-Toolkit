import React from 'react';
import './App.css';

export default function Donate() {
  return (
    <div className="container" style={{ width: 500 }}>
      <h1>投喂作者</h1>
      <div style={{ textAlign: 'left', fontSize: 17, lineHeight: 1.8 }}>
        如果你觉得本工具对你有帮助，欢迎自愿投喂作者一杯奶茶 ☕ 或一份小小的支持！
        <br /><br />
        <b>微信收款码：</b>
        <br />
        <img src="/my-donate.jpg" alt="捐赠二维码" style={{ width: 180, marginTop: 12, borderRadius: 12, boxShadow: '0 2px 8px #1677ff22' }} />
        <br /><br />
        <b>感谢每一位支持者！</b>
        <br />
        <span style={{ color: '#888', fontSize: 15 }}>（本页面仅为自愿支持，功能永久免费）</span>
      </div>
    </div>
  );
}
