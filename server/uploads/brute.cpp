#include <bits/stdc++.h>
#define int long long 
using namespace std;

void solve(){
    int k,a,b,x,y;
    cin >> k >> a >> b >> x >> y;
    if(k < a && k < b){
        cout << 0 << '\n';
        return;
    }
    int ans = 0;
    if(x > y){
        swap(x, y);
        swap(a, b);
    }
    if(k < a){

    }else{
        int times = (k - a) / x + 1;
        ans += times;
        k -= times * x;
    }
    if(k < b){
        cout << ans << '\n';
        return;
    }else{
        int times = (k - b) / y + 1;
        ans += times;
        cout << ans << '\n'; 
    }
    

}

signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0),cout.tie(0);
    int t = 1;
    cin >> t;
    while(t--){
        solve();
    }
    return 0;
}