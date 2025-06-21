#include <bits/stdc++.h>
#define int long long
using namespace std;

typedef pair<int,int> pii;

const int N = 2e5+1;

long long binpow(long long a,long long b){
    long long res = 1;
    while(b>0){
        if(b&1)res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}

vector<int>pri;
bool not_prime[N];
void pre(int n){
    for(int i = 2;i <= n;i++){
        if(!not_prime[i]){
            pri.push_back(i);
        }
        for(int pri_j : pri){
            if(i * pri_j > n)break;
            not_prime[i*pri_j]=true;
            if(i%pri_j==0){
                break;
            }
        }
    }
}

void solve(){

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