#include<bits/stdc++.h>
using namespace std;

using u64 = unsigned long long;
using i64 = long long;
using u32 = unsigned;


const int mod = 998244353;
const int N = 3e5 + 5;
const int M = 3e5 + 5;

void solve(int tc)
{
    int n;
    cin >> n;
    vector<char> c(n + 1);
    for(int i = 1; i <= n; i++) {
        cin >> c[i];
    }

    vector<int> cost(17);
    for(int i = 0; i < 17; i++) {
        cin >> cost[i];
    }

    int len;
    cin >> len;

    if(len & 1) {
        len += 1;
        if(len > n) {
            return cout << 0 << '\n', void();
        }
    }

    vector<int> ok(1 << 17, 1);
    for(int i = 1; i + len - 1 <= n; i++) {
        int state = 0;
        int sum = i + i + len - 1;
        for(int j = i; j <= i + len / 2 - 1; j++) {
            if(c[j] != c[sum - j]) {
                int mn = min(c[j] - 'a', c[sum - j] - 'a');
                state |= 1 << mn;
            } else {
                state = 0;
                break;
            }
        }
        if(state) ok[state] = 0;
    }

    for(int d = 0; d < 17; d++) {
        for(int s = 0; s < 1 << 17; s++) {
            if(s & 1 << d) {
                ok[s] &= ok[s ^ 1 << d];
            }
        }
    }

    int ans = 1e9;
    for(int s = 0; s < 1 << 17; s++) {
        if(ok[s]) {
            int sum = 0;
            for(int i = 0; i < 17; i++) {
                if(!(s >> i & 1)) {
                    sum += cost[i];
                }
            }
            ans = min(ans, sum);
        }
    }

    cout << ans << '\n';
}

signed main()
{
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);

    int T = 1;
    cin >> T;

    for(int tc = 1; tc <= T; tc++) {
       solve(tc);
    }

    return 0;
}