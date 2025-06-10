document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const passedCasesElement = document.getElementById('passed-cases');
    const failedCasesElement = document.getElementById('failed-cases');
    const tableBody = document.querySelector('#testcases-table tbody');
    
    // 从服务器加载测试报告数据
    // 修改fetch路径为相对路径
    fetch('./testcases/report.json')  // 添加当前目录标识符
        .then(response => {
            if (!response.ok) {
                throw new Error('测试报告加载失败');
            }
            return response.json();
        })
        .then(data => {
            // 添加总测试用例统计
            document.getElementById('total-cases').textContent = data.summary.total;
            passedCasesElement.textContent = data.summary.passed;
            failedCasesElement.textContent = data.summary.failed;
            
            // 清空表格
            tableBody.innerHTML = '';
            
            // 生成测试用例表格行
            data.testcases.forEach(testcase => {
                const row = document.createElement('tr');
                
                // 测试用例ID
                const idCell = document.createElement('td');
                idCell.textContent = testcase.id;
                row.appendChild(idCell);
                
                // 输入数据（修复链接生成逻辑）
                const inputCell = document.createElement('td');
                const inputLink = document.createElement('a');
                inputLink.href = `./testcases/${testcase.id}/data.in`;
                inputLink.textContent = '查看输入';
                inputLink.target = '_blank';
                inputCell.appendChild(inputLink);
                row.appendChild(inputCell);
                
                // 预期输出（修复变量声明）
                const expectedCell = document.createElement('td');
                const expectedLink = document.createElement('a');
                expectedLink.href = `./testcases/${testcase.id}/data.out1`;
                expectedLink.textContent = '查看预期';
                expectedLink.target = '_blank';
                expectedCell.appendChild(expectedLink);
                row.appendChild(expectedCell);
                
                // 实际输出（修复变量声明）
                const actualCell = document.createElement('td');
                const actualLink = document.createElement('a');
                actualLink.href = `./testcases/${testcase.id}/data.out2`;
                actualLink.textContent = '查看实际'; 
                actualLink.target = '_blank';
                actualCell.appendChild(actualLink);
                row.appendChild(actualCell);
                
                // 状态
                const statusCell = document.createElement('td');
                statusCell.textContent = testcase.status === 'passed' ? '通过' : '失败';
                statusCell.className = testcase.status === 'passed' ? 'status-passed' : 'status-failed';
                row.appendChild(statusCell);
                
                // 差异
                const diffCell = document.createElement('td');
                // 在文件开头添加差异查看器容器
                const diffContainer = document.createElement('div');
                diffContainer.id = 'diff-viewer';
                diffContainer.style.cssText = `
                    position: fixed;
                    top: 0; right: -400px;
                    width: 400px; height: 100%;
                    background: white;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                    transition: right 0.3s;
                    padding: 20px;
                    overflow-y: auto;
                `;
                document.body.appendChild(diffContainer);
                
                // 修改差异链接的点击处理
                if (testcase.status === 'failed') {
                    const diffLink = document.createElement('a');
                    diffLink.href = '#';
                    diffLink.textContent = '查看差异';
                    // 在文件开头添加全局状态
                    let isDiffPanelOpen = false;
                    
                    // 在创建对比面板的代码后添加键盘事件监听
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape' && isDiffPanelOpen) {
                            closeDiffPanel();
                        }
                    });
                    
                    // 修改打开对比面板的逻辑
                    diffLink.onclick = (e) => {
                        e.preventDefault();
                        fetch(`./testcases/${testcase.id}/diff.html`)
                            .then(r => r.text())
                            .then(html => {
                                diffContainer.innerHTML = html;
                                diffContainer.style.right = '0';
                                isDiffPanelOpen = true; // 更新面板状态
                            });
                    };
                    
                    // 修改关闭函数
                    function closeDiffPanel() {
                        diffContainer.style.right = '-400px';
                        diffContainer.innerHTML = '';
                        isDiffPanelOpen = false; // 重置面板状态
                    }
                    diffCell.appendChild(diffLink);
                }
                
                // 添加关闭按钮
                // 在差异查看器容器中添加关闭按钮
                const closeBtn = document.createElement('button');

                closeBtn.innerHTML = '&times; 关闭';
                closeBtn.style.cssText = `



                    position: sticky;
                    top: 10px;
                    float: right;
                    padding: 8px 15px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: opacity 0.3s;
                `;

                closeBtn.onmouseenter = () => closeBtn.style.opacity = '0.8';
                closeBtn.onmouseleave = () => closeBtn.style.opacity = '1';
                closeBtn.onclick = () => {
                    diffContainer.style.right = '-400px';
                    diffContainer.innerHTML = '';  // 清空内容
                };
                diffContainer.appendChild(closeBtn);
                row.appendChild(diffCell);
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('加载测试报告时出错:', error);
            // 显示错误信息
            const errorRow = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.colSpan = 6;
            errorCell.textContent = '无法加载测试报告: ' + error.message;
            errorCell.style.color = '#e74c3c';
            errorCell.style.textAlign = 'center';
            errorRow.appendChild(errorCell);
            tableBody.appendChild(errorRow);
        });
});
