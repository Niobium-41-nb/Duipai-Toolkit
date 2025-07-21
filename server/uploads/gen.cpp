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
constexpr int N = 2e5 + 10;
int T;
int a[N];
vector<pii>edge[N];
signed main() {
    fstdio;
    srand(time(NULL));
    int T = 1;
    cout << 1 << endl;
    while (T--) {
        int n = rand() % 50 + 1;
        cout << n << endl;
        cf(i, 1, n) {
            int n = rand() % 17;
            char x = n + 'a';
            cout << x;
        }
        cout << endl;
        cf(i, 1, 17) {
            int n = rand() % 1000 + 1;
            cout << n << " ";
        }
        cout << endl;
        int len = rand() % n + 1;
        cout << len << endl;
    }
}