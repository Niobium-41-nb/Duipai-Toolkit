// Node.js + Express 后端入口，支持 C++ 代码编译、运行与对拍逻辑
/* eslint-disable */
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3001;

// 兼容 __dirname
// const __dirname = path.resolve();

app.use(cors());
app.use(fileUpload());
app.use(express.json());

// 上传接口：接收 brute.cpp、prog.cpp、gen.cpp 或预设
app.post('/api/upload', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  // 允许 gen.cpp 缺省（用预设）
  if (!req.files || !req.files.brute || !req.files.prog) {
    return res.status(400).json({ error: '请上传 brute.cpp、prog.cpp' });
  }
  req.files.brute.mv(path.join(uploadDir, 'brute.cpp'));
  req.files.prog.mv(path.join(uploadDir, 'prog.cpp'));
  if (req.files.gen) {
    req.files.gen.mv(path.join(uploadDir, 'gen.cpp'));
  } else if (req.body.preset) {
    // 写入预设生成器代码
    let presetCode = '';
    if (req.body.preset === 'random-int') {
      presetCode = `#include <iostream>\n#include <cstdlib>\nusing namespace std;\nint main() {\n  int n = rand() % 10 + 1;\n  for (int i = 0; i < n; ++i) cout << (rand()%100) << ' ';\n  cout << endl;\n}`;
    } else if (req.body.preset === 'permutation') {
      presetCode = `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n  int n = 5;\n  vector<int> a(n);\n  for(int i=0;i<n;++i)a[i]=i+1;\n  random_shuffle(a.begin(),a.end());\n  for(int x:a)cout<<x<<' ';\n  cout<<endl;\n}`;
    }
    fs.writeFileSync(path.join(uploadDir, 'gen.cpp'), presetCode);
  } else {
    return res.status(400).json({ error: '请上传 gen.cpp 或选择预设' });
  }
  res.json({ message: '上传成功' });
});

// 对拍接口：编译并运行多组数据
app.post('/api/duipai', async (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  const rounds = 10; // 对拍轮数
  const timeout = 2000; // ms
  // 编译
  function compile(src, out) {
    return new Promise((resolve, reject) => {
      execFile('g++', [src, '-O2', '-std=c++17', '-o', out], { timeout: 10000 }, (err, stdout, stderr) => {
        if (err) reject(stderr || err.message); else resolve();
      });
    });
  }
  // 运行可执行文件，输入input，返回stdout
  function runExe(exe, input) {
    return new Promise((resolve, reject) => {
      const p = execFile(exe, { timeout }, (err, stdout, stderr) => {
        if (err) reject(stderr || err.message); else resolve(stdout);
      });
      if (p.stdin) {
        p.stdin.write(input);
        p.stdin.end();
      }
    });
  }
  // 逐行去除末尾空白
  function trimLines(str) {
    return str.split(/\r?\n/).map(s => s.trimEnd()).join('\n').trim();
  }
  try {
    await compile(path.join(uploadDir, 'brute.cpp'), path.join(uploadDir, 'brute.exe'));
    await compile(path.join(uploadDir, 'prog.cpp'), path.join(uploadDir, 'prog.exe'));
    await compile(path.join(uploadDir, 'gen.cpp'), path.join(uploadDir, 'gen.exe'));
  } catch (e) {
    return res.json({ status: 'compile_error', error: e.toString() });
  }
  const results = [];
  for (let i = 0; i < rounds; ++i) {
    let input = '';
    try {
      input = await runExe(path.join(uploadDir, 'gen.exe'), '');
    } catch (e) {
      results.push({ input: '', brute: '', prog: '', ok: false, error: '数据生成失败: ' + e.toString() });
      continue;
    }
    let bruteOut = '', progOut = '';
    let bruteErr = '', progErr = '';
    try {
      bruteOut = await runExe(path.join(uploadDir, 'brute.exe'), input);
    } catch (e) {
      bruteErr = e.toString();
    }
    try {
      progOut = await runExe(path.join(uploadDir, 'prog.exe'), input);
    } catch (e) {
      progErr = e.toString();
    }
    // 比对输出
    const ok = !bruteErr && !progErr && trimLines(bruteOut) === trimLines(progOut);
    results.push({
      input: input.trim(),
      brute: bruteErr ? `[运行错误]\n${bruteErr}` : bruteOut.trim(),
      prog: progErr ? `[运行错误]\n${progErr}` : progOut.trim(),
      ok,
      error: bruteErr || progErr || ''
    });
  }
  res.json({ status: 'success', results });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
