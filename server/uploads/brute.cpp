#include <bits/stdc++.h>
#define int long long
using namespace std;

void solve(){
    int n;
    cin >> n;
    vector<int>arr(n+1,0);
    for(int i = 1;i <= n;i++){
        cin >> arr[i];
    }
    vector<set<int>>nums;
    vector<map<int,int>>times;
    set<int>st;
    map<int,int>mp;
    for(int i = n;i >= 1;i--){
        int num = arr[i];
        if(st.empty()){
            st.insert(num);
            mp[num]=1;
        }else{
            if(st.find(num)!=st.end()){
                nums.push_back(st);
                times.push_back(mp);
                st.clear(),mp.clear();
                st.insert(num);
                mp[num]=1;
            }else{
                st.insert(num);
                mp[num]=1;
            }
        }
    }
    if(!st.empty()){
        nums.push_back(st);
        times.push_back(mp);
    }
    // for(int i = 0;i < nums.size();i++){
    //     for(int j : nums[i]){
    //         cout << j << ' ';
    //     }
    //     cout << '\n';
    // }
    int cnt = 1;
    if(nums.size() == 1){
        cout << 1 << '\n';
        return;
    }
    for(int i = nums.size()-1;i > 0;i--){
        bool can = true;
        for(int j : nums[i]){
            if(nums[i-1].find(j) == nums[i-1].end()){
                can = false;
            }
        }
        if(can == false){
            break;
        }
        cnt++;
    }

    cout << cnt << '\n';
}
void solve1(){
    int n;
    cin >> n;
    vector<int>arr(n+1,0);
    for(int i = 1;i <= n;i++){
        cin >> arr[i];
    }
    int cnt = 1;
    set<int>now;
    set<int>temp_now;
    set<int>next;
    for(int i = 1;i <= n;i++){
        if(i == 1){
            now.insert(arr[i]);
            temp_now = now;
        }else{
            next.insert(arr[i]);
            temp_now.erase(arr[i]);
            if(temp_now.empty()){
                cnt++;
                now = next;
                temp_now = now;
                next.clear();
            }
        }
    }
    cout << cnt << '\n';
}
signed main(){
    ios::sync_with_stdio(0);
    cin.tie(0),cout.tie(0);
    int t = 1;
    cin >> t;
    while(t--){
        solve1();
    }
}