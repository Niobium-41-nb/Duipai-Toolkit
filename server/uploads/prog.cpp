#include <bits/stdc++.h>
#define int long long 
using namespace std;

void solve(){
    int w,h,a,b;
    cin >> w >> h >> a >> b;
    int x1,y1,x2,y2;
    cin >> x1 >> y1 >> x2 >> y2;
    int mina = abs(x1-x2)-a;
    int minb = abs(y1-y2)-b;
    if(mina % a == 0 && mina >= 0 || minb % b ==0 && minb >= 0){
        cout << "Yes\n";
    }else{
        cout << "No\n";
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