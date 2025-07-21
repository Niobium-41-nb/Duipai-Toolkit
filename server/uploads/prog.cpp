#include<iostream>
#include<algorithm>
#include<cmath>
#include<vector>
#include<cstring>
#include<string>
#include<iomanip>
#include<queue>
#include<stack>
#include<map>
#include<set>
#include<utility>
#include<cstdio>
#include<cstdlib>
#include<climits>
#include<cstdint>
#include<unordered_map>
#include<unordered_set>
#include<bitset>
using namespace std;
template<class G> inline void read(G& x)
{
    bool f; char ch = getchar();
    for (f = 0; !isdigit(ch); ch = getchar())if (ch == '-')f = 1;
    for (x = 0; isdigit(ch); x = (x << 1) + (x << 3) + (ch ^ 48), ch = getchar());
    x *= f == 1 ? -1 : 1;
}
template<class G>inline void write(G x) {
    if (x > 9) write(x / 10);
    putchar(x % 10 + '0');
}
template <typename T1>istream& operator>>(istream& cin, vector<T1>& a) {
    for (auto& x : a)
        cin >> x;
    return cin;
}
#define int long long
#define ll long long 
#define INF 0x3f3f3f
#define f(i,s,e) for(int i=s;i<e;++i)
#define cf(i,s,e) for(int i=s;i<=e;++i)
#define rf(i,e,s) for(int i=e;i>s;--i)
#define pb push_back
#define db double
#define pii pair<int,int>
#define fstdio ios_base::sync_with_stdio(false);cin.tie(0); cout.tie(0)
#define endl '\n'
#define lowbit(x) (x & (-x))
#define vi vector<int>
#define vii vector<vi>
const double Pi = acos(-1.0);
constexpr int MOD = 1e9 + 7;
inline int gcd(int x, int y) {
    return y ? gcd(y, x % y) : x;
}
inline int qpow(int x, int y) {
    int res = 1;
    while (y) {
        if (y & 1) {
            res = (res * x) % MOD;
        }
        x = (x * x) % MOD;
        y /= 2;
    }
    return res;
}
inline int inv(int x) {
    return qpow(x, MOD - 2);
}
constexpr int N = 1e6 + 10;
int T;
char a[N];
int b[N];
int fac[N];
int dp[N];
//正难则反
//考虑不合法方案有哪些，如果子集不合法，那么他必然不合法
//那么我们设计dp状态为这个dp[i] -> 状压不合法的集合，如果二进制位为1，那么这个位置不取，如果为0，这个位置才取
signed main() {
    fstdio;
    cin >> T;
    fac[0] = 1;
    for (int i = 1; i <= 20; i++) {
        fac[i] = fac[i - 1] * 2;
    }
    while (T--) {
        int n;
        cin >> n;
        cf(i, 1, n)cin >> a[i];
        cf(i, 1, 17)cin >> b[i];
        int len;
        cin >> len;
        if (n == len && n % 2 == 1) {
            cout << 0 << endl;
            continue;
        }
        len += (len % 2 == 1);
        for (int i = 1; i <= n - len + 1; i++) {
            int res = 0;
            for (int j = 0; j <= len / 2 - 1; j++) {//计算不合法集合，这些位置我都不取
                if (a[i + j] == a[i + len - 1 - j])continue;
                char x = min(a[i + j], a[i + len - 1 - j]);//只计算不同的
                res |= fac[x - 'a'];
            }
            if (res)dp[res] = 1;
        }
        int ans = 1e18;
        for (int i = 0; i <= fac[16] - 1; i++) {
            int res = 0;
            for (int j = 0; j < 16; j++) {
                if ((i & fac[j]) == 0) {
                    dp[i ^ fac[j]] |= dp[i];
                    res += b[j + 1];
                }
            }
            bool ok = dp[i];
            if (!ok) {
                ans = min(ans, res);
            }
        }
        cout << ans << endl;
        cf(i, 0, (1LL << 16)) {
            dp[i] = 0;
        }
    }
}
/*
1
5
aaaaa
1 2 3 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5
*/