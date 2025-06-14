import { useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import './App.css'

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
    try {
      const resp = await fetch('http://localhost:3001/api/upload', {
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
      const res = await fetch('http://localhost:3001/api/duipai', { method: 'POST' });
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setError('对拍失败');
    }
    setLoading(false);
  };

  return (
    <div className="container">
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
            <MonacoEditor height="120px" defaultLanguage="cpp" value={editor.brute} onChange={v => handleEditorChange(v, 'brute')} options={{ fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>测试解 prog.cpp</b>
            <MonacoEditor height="120px" defaultLanguage="cpp" value={editor.prog} onChange={v => handleEditorChange(v, 'prog')} options={{ fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>数据生成 gen.cpp</b>
            <MonacoEditor height="120px" defaultLanguage="cpp" value={editor.gen} onChange={v => handleEditorChange(v, 'gen')} options={{ fontSize: 14 }} />
          </div>
        </div>
      ) : (
        <div className="upload-section">
          <label>暴力解 brute.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'brute')} /></label><br />
          <label>测试解 prog.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'prog')} /></label><br />
          <label>数据生成 gen.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'gen')} /></label><br />
        </div>
      )}
      <div className="upload-section">
        <label>或选择预设生成器: 
          <select value={preset} onChange={e => setPreset(e.target.value)}>
            <option value="">--无--</option>
            <option value="random-int">随机整数生成器</option>
            <option value="permutation">排列生成器</option>
          </select>
        </label>
        <br />
        <button onClick={handleUpload} disabled={loading}>上传并对拍</button>
        {error && <div className="error">{error}</div>}
      </div>
      <div className="result-section">
        <h2>对拍结果</h2>
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
            {results.map((r, i) => (
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
    </div>
  );
}

export default App;
