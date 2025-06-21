import About from './About.jsx';
import Donate from './Donate.jsx';
import { useState, useEffect } from 'react'
import MonacoEditor from '@monaco-editor/react'
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import './App.css'

// 预设与文件名映射
const presetFileMap = {
  'random-int': 'presets/random-int.cpp',
  'permutation': 'presets/permutation.cpp',
  'multi-random-array': 'presets/multi-random-array.cpp',
};

// 获取 API 基础路径，开发环境用 localhost，生产用相对路径
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

function App() {
  // 文件状态
  const [files, setFiles] = useState({ brute: null, prog: null, gen: null });
  // 预设生成器
  const [preset, setPreset] = useState('');
  // 对拍结果
  const [results, setResults] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 错误信息
  const [error, setError] = useState('');
  // 代码编辑器内容
  const [editor, setEditor] = useState({ brute: '', prog: '', gen: '' });
  const [useEditor, setUseEditor] = useState(false);
  // 预设代码内容缓存与加载状态
  const [presetCodes, setPresetCodes] = useState({});
  const [presetLoading, setPresetLoading] = useState('');
  const [hoverPreset, setHoverPreset] = useState('');
  // 对拍轮数
  const [rounds, setRounds] = useState(10);
  const [showOnlyDiff, setShowOnlyDiff] = useState(false); // 只显示不一致
  const [page, setPage] = useState('main');
  // 导出对拍结果为 txt 或 zip
  const [downloadFormat, setDownloadFormat] = useState('txt');

  // 悬停时动态加载对应 cpp 文件内容（只首次 fetch）
  useEffect(() => {
    if (hoverPreset && presetFileMap[hoverPreset] && !presetCodes[hoverPreset]) {
      setPresetLoading(hoverPreset);
      fetch(presetFileMap[hoverPreset] + '?t=' + Date.now())
        .then(res => res.text())
        .then(code => {
          setPresetCodes(codes => ({ ...codes, [hoverPreset]: code }));
          setPresetLoading('');
        })
        .catch(() => {
          setPresetCodes(codes => ({ ...codes, [hoverPreset]: '// 读取失败' }));
          setPresetLoading('');
        });
    }
  }, [hoverPreset, presetCodes]);

  // 处理文件选择
  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  // 编辑器内容变更
  const handleEditorChange = (value, key) => {
    setEditor({ ...editor, [key]: value });
  };

  // 上传文件到后端
  const handleUpload = async () => {
    setError('');
    if (useEditor) {
      if (!editor.brute || !editor.prog || (!editor.gen && !preset)) {
        setError('请填写所有必需代码或选择预设生成器');
        return;
      }
    } else {
      if (!files.brute || !files.prog || (!files.gen && !preset)) {
        setError('请上传所有必需文件或选择预设生成器');
        return;
      }
    }
    setLoading(true);
    const formData = new FormData();
    if (useEditor) {
      formData.append('brute', new Blob([editor.brute], { type: 'text/plain' }), 'brute.cpp');
      formData.append('prog', new Blob([editor.prog], { type: 'text/plain' }), 'prog.cpp');
      if (editor.gen) formData.append('gen', new Blob([editor.gen], { type: 'text/plain' }), 'gen.cpp');
    } else {
      formData.append('brute', files.brute);
      formData.append('prog', files.prog);
      if (files.gen) formData.append('gen', files.gen);
    }
    if (preset) formData.append('preset', preset);
    formData.append('rounds', rounds);
    try {
      const resp = await fetch(API_BASE + '/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setError(data.error || '上传失败');
        setLoading(false);
        return;
      }
      // 上传成功后自动发起对拍
      await handleDuipai();
    } catch {
      setError('上传失败，无法连接服务器');
    }
    setLoading(false);
  };

  // 发起对拍请求
  const handleDuipai = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE + '/api/duipai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rounds })
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setError('对拍失败');
    }
    setLoading(false);
  };

  // 导出对拍结果为 txt、zip、xlsx、json
  const handleDownloadResults = async () => {
    if (!results.length) return;
    const filtered = showOnlyDiff ? results.filter(r => !r.ok) : results;
    if (downloadFormat === 'txt') {
      let txt = '输入\t暴力解输出\t测试解输出\t一致\n';
      filtered.forEach((r, i) => {
        txt += `【第${i+1}组】\n`;
        txt += `输入:\n${r.input}\n`;
        txt += `暴力解输出:\n${r.brute}\n`;
        txt += `测试解输出:\n${r.prog}\n`;
        txt += `一致: ${r.ok ? '✔️' : '❌'}\n`;
        if (r.error) txt += `错误信息: ${r.error}\n`;
        txt += '\n';
      });
      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `duipai-results-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } else if (downloadFormat === 'zip') {
      const zip = new JSZip();
      filtered.forEach((r, i) => {
        zip.file(`case${i+1}/data.in`, r.input || '');
        zip.file(`case${i+1}/data.out1`, r.brute || '');
        zip.file(`case${i+1}/data.out2`, r.prog || '');
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `duipai-results-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } else if (downloadFormat === 'xlsx') {
      const wsData = [
        ['组号', '输入', '暴力解输出', '测试解输出', '一致', '错误信息'],
        ...filtered.map((r, i) => [
          i+1, r.input, r.brute, r.prog, r.ok ? '✔️' : '❌', r.error || ''
        ])
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '对拍结果');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `duipai-results-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } else if (downloadFormat === 'json') {
      const json = JSON.stringify(filtered, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `duipai-results-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  if (page === 'about') {
    return (
      <div>
        <button style={{ position: 'absolute', left: 24, top: 24 }} onClick={() => setPage('main')}>← 返回首页</button>
        <About />
      </div>
    );
  }
  if (page === 'donate') {
    return (
      <div>
        <button style={{ position: 'absolute', left: 24, top: 24 }} onClick={() => setPage('main')}>← 返回首页</button>
        <Donate />
      </div>
    );
  }

  return (
    <div className="container" style={{ width: 500 }}>
      <img src="/author.jpg" alt="项目Logo" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 18px auto', display: 'block', boxShadow: '0 2px 8px #1677ff22' }} />
      <h1>算法竞赛对拍工具</h1>
      <div style={{ textAlign: 'right', marginBottom: 8 }}>
        <label>
          <input type="checkbox" checked={useEditor} onChange={e => setUseEditor(e.target.checked)} /> 使用在线代码编辑器
        </label>
      </div>
      {useEditor ? (
        <div className="editor-section">
          <div style={{ marginBottom: 16 }}>
            <b>暴力解 brute.cpp</b>
            <MonacoEditor
              height="180px"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={editor.brute || ''}
              onChange={v => handleEditorChange(v, 'brute')}
              options={{ fontSize: 15, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'on', placeholder: '// 在此输入暴力解 C++ 代码' }}
              className="monaco-border"
              loading={<CustomMonacoLoading />}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>测试解 prog.cpp</b>
            <MonacoEditor
              height="180px"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={editor.prog || ''}
              onChange={v => handleEditorChange(v, 'prog')}
              options={{ fontSize: 15, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'on', placeholder: '// 在此输入测试解 C++ 代码' }}
              className="monaco-border"
              loading={<CustomMonacoLoading />}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>数据生成 gen.cpp</b>
            <MonacoEditor
              height="180px"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={editor.gen || ''}
              onChange={v => handleEditorChange(v, 'gen')}
              options={{ fontSize: 15, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'on', placeholder: '// 在此输入数据生成器 C++ 代码' }}
              className="monaco-border"
              loading={<CustomMonacoLoading />}
            />
          </div>
        </div>
      ) : (
        <div className="upload-section">
          <label>暴力解 brute.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'brute')} /></label><br />
          <label>测试解 prog.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'prog')} /></label><br />
          <label>数据生成 gen.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'gen')} /></label><br />
        </div>
      )}
      <div className="upload-section" style={{ position: 'relative' }}>
        <label style={{ marginRight: 16 }}>
          对拍轮数: <input type="number" min={1} max={100} value={rounds} onChange={e => setRounds(Number(e.target.value))} style={{ width: 60, marginLeft: 4 }} />
        </label>
        <label>或选择预设生成器: 
          <select
            value={preset}
            onChange={e => setPreset(e.target.value)}
            onMouseLeave={() => setHoverPreset('')}
          >
            <option value="" onMouseEnter={() => setHoverPreset('')}>--无--</option>
            <option value="random-int" onMouseEnter={() => setHoverPreset('random-int')}>随机整数生成器</option>
            <option value="permutation" onMouseEnter={() => setHoverPreset('permutation')}>排列生成器</option>
            <option value="multi-random-array" onMouseEnter={() => setHoverPreset('multi-random-array')}>多组随机数组生成器</option>
          </select>
        </label>
        {hoverPreset && (
          <div style={{
            position: 'absolute',
            left: 260,
            top: 0,
            zIndex: 10,
            background: '#f6f8fa',
            color: '#333',
            border: '1px solid #d0d7de',
            borderRadius: 8,
            padding: 12,
            minWidth: 320,
            maxWidth: 520,
            maxHeight: 320,
            fontSize: 13,
            fontFamily: 'Fira Mono, Consolas, monospace',
            boxShadow: '0 2px 8px #1677ff22',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <span style={{fontWeight:600}}>预设代码预览</span>
              <button style={{fontSize:12,padding:'2px 8px',cursor:'pointer'}} onClick={() => {
                if (presetCodes[hoverPreset]) {
                  navigator.clipboard.writeText(presetCodes[hoverPreset]);
                }
              }}>复制</button>
            </div>
            <div style={{flex:1,overflow:'auto'}}>
              {presetLoading === hoverPreset ? (
                <span style={{color:'#888'}}>Loading...</span>
              ) : (
                <pre style={{margin:0}}>{presetCodes[hoverPreset] || ''}</pre>
              )}
            </div>
          </div>
        )}
        <br />
        <button onClick={handleUpload} disabled={loading}>上传并对拍</button>
        {error && <div className="error">{error}</div>}
      </div>
      <div className="result-section">
        <h2>对拍结果</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <label style={{ fontSize: 15, fontWeight: 400, marginRight: 16 }}>
              <input type="checkbox" checked={showOnlyDiff} onChange={e => setShowOnlyDiff(e.target.checked)} style={{ marginRight: 4 }} />
              只显示不一致
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select value={downloadFormat} onChange={e => setDownloadFormat(e.target.value)} style={{ fontSize: 14, marginRight: 4 }}>
              <option value="txt">导出为 TXT</option>
              <option value="zip">导出为 data.in/data.out1/data.out2 (ZIP)</option>
              <option value="xlsx">导出为 Excel (XLSX)</option>
              <option value="json">导出为 JSON</option>
            </select>
            <button onClick={handleDownloadResults} disabled={!results.length} style={{ fontSize: 14 }}>
              下载对拍结果
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>输入</th>
              <th>暴力解输出</th>
              <th>测试解输出</th>
              <th>一致</th>
            </tr>
          </thead>
          <tbody>
            {(showOnlyDiff ? results.filter(r => !r.ok) : results).map((r, i) => (
              <tr key={i} style={{ background: r.ok ? '#eaffea' : '#ffeaea' }}>
                <td><pre>{r.input}</pre></td>
                <td><pre>{r.brute}</pre></td>
                <td><pre>{r.prog}</pre></td>
                <td>{r.ok ? '✔️' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button onClick={() => setPage('about')} style={{ fontSize: 15, marginRight: 16 }}>关于我们</button>
        <button onClick={() => setPage('donate')} style={{ fontSize: 15 }}>投喂</button>
      </div>
    </div>
  );
}

function CustomMonacoLoading() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#1677ff', fontSize: 18, background: 'transparent', borderRadius: 8
    }}>
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ marginBottom: 10 }}>
        <circle cx="20" cy="20" r="16" stroke="#1677ff" strokeWidth="4" fill="none" strokeDasharray="80" strokeDashoffset="60">
          <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
      Monaco 编辑器加载中...
    </div>
  );
}

export default App;
