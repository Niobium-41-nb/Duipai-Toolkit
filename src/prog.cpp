#include <bits/stdc++.h>
#define ent '\n'
//#define int long long

using namespace std;
typedef long long ll;

const int maxn = 3e5 + 12;

const int mod = 1e9 + 7;

vector<int> g[maxn];
int a[maxn], b[maxn];
int n, m, k;

void solve() {
    cin >> n;
    for(int i = 1; i <= n; i++) {
        cin >> a[i];
        g[i].clear();
    }
    for(int i = 1; i <= n; i++) {
        cin >> b[i];
    }

    int ans = 0;
    for(int i = n; i; i--) {
        for(int pos : g[a[i]]) {
            if(pos == i + 1) continue;
            ans = max(ans, i);
            break;
        }
        for(int pos : g[b[i]]) {
            if(pos == i + 1) continue;
            ans = max(ans, i);
            break;
        }
        if(i < n && (a[i] == b[i] || a[i] == a[i + 1] || b[i] == b[i + 1])) {
            ans = max(ans, i);
            break;
        }
        g[a[i]].push_back(i);
        g[b[i]].push_back(i);
    }
    cout << ans << ent;
}

int32_t main() {
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    cout.tie(0);

    int t = 1;
    cin >> t;
    while(t--) {
        solve();
    }
}