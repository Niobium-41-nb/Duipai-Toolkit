import React from 'react';
import './App.css';

export default function About() {
  return (
    <div className="container" style={{ width: 500 }}>
      <h1>关于我们</h1>
      <div style={{ textAlign: 'left', fontSize: 17, lineHeight: 1.8 }}>
        <b>Duipai Toolkit</b> 是由算法竞赛爱好者开发的开源对拍工具，致力于帮助算法竞赛选手高效验证代码正确性。
        <br /><br />
        <b>作者: </b> <br /><a href="https://space.bilibili.com/1517205544" target="_blank" rel="noopener noreferrer">钒钒（bilibili）</a>
        <br />
        <b>      </b> <a href="https://codeforces.com/profile/vanadium-23" target="_blank" rel="noopener noreferrer">vanadium-23（codeforces）</a>
        <br />
        <b>      </b> <a href="https://github.com/Niobium-41-nb/Niobium-41-nb" target="_blank" rel="noopener noreferrer">Niobium-41-nb（GitHub）</a>
        <br />
        <b>项目主页：</b> <br /><a href="https://github.com/Niobium-41-nb/Duipai-Toolkit" target="_blank" rel="noopener noreferrer">GitHub - Duipai Toolkit</a>
        <br /><br />
        <b>广告：</b> 欢迎关注作者B站账号，获取更多算法竞赛干货与工具！https://space.bilibili.com/1517205544
        <br />
        <b>许可：</b> 本项目采用 MIT 许可证，您可以自由使用、修改和分发代码，但请保留原作者信息。
      </div>
    </div>
  );
}
