import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import './App.css';

export default function Exchange() {
  const [files, setFiles] = useState({ brute: null, work: null, gen: null });
  const [editor, setEditor] = useState({ brute: '', work: '', gen: '' });
  const [useEditor, setUseEditor] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rounds, setRounds] = useState(10);

  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };
  const handleEditorChange = (value, key) => {
    setEditor({ ...editor, [key]: value });
  };
  const handleUpload = async () => {
    setError('');
    if (useEditor) {
      if (!editor.brute || !editor.work || !editor.gen) {
        setError('请填写所有必需代码');
        return;
      }
    } else {
      if (!files.brute || !files.work || !files.gen) {
        setError('请上传所有必需文件');
        return;
      }
    }
    setLoading(true);
    const formData = new FormData();
    if (useEditor) {
      formData.append('brute', new Blob([editor.brute], { type: 'text/plain' }), 'brute.cpp');
      formData.append('work', new Blob([editor.work], { type: 'text/plain' }), 'work.cpp');
      formData.append('gen', new Blob([editor.gen], { type: 'text/plain' }), 'gen.cpp');
    } else {
      formData.append('brute', files.brute);
      formData.append('work', files.work);
      formData.append('gen', files.gen);
    }
    formData.append('rounds', rounds);
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
      await handleDuipai();
    } catch {
      setError('上传失败，无法连接服务器');
    }
    setLoading(false);
  };
  const handleDuipai = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/duipai', {
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
  return (
    <div className="container" style={{ width: 500 }}>
      <h1>交互题对拍</h1>
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
            <b>交换机 work.cpp</b>
            <MonacoEditor height="120px" defaultLanguage="cpp" value={editor.work} onChange={v => handleEditorChange(v, 'work')} options={{ fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>数据生成 gen.cpp</b>
            <MonacoEditor height="120px" defaultLanguage="cpp" value={editor.gen} onChange={v => handleEditorChange(v, 'gen')} options={{ fontSize: 14 }} />
          </div>
        </div>
      ) : (
        <div className="upload-section">
          <label>暴力解 brute.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'brute')} /></label><br />
          <label>交换机 work.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'work')} /></label><br />
          <label>数据生成 gen.cpp: <input type="file" accept=".cpp" onChange={e => handleFileChange(e, 'gen')} /></label><br />
        </div>
      )}
      <div className="upload-section">
        <label style={{ marginRight: 16 }}>
          对拍轮数: <input type="number" min={1} max={100} value={rounds} onChange={e => setRounds(Number(e.target.value))} style={{ width: 60, marginLeft: 4 }} />
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
              <th>交换机输出</th>
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
