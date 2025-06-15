#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
using namespace std;
int main() {
  int n = 5;
  vector<int> a(n);
  for(int i=0;i<n;++i)a[i]=i+1;
  random_device rd;
  mt19937 g(rd());
  shuffle(a.begin(), a.end(), g);
  for(int x:a)cout<<x<<' ';
  cout<<endl;
}
