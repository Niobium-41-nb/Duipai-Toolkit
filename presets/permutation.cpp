#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <chrono> 

using namespace std;
int main() {
  auto now = std::chrono::high_resolution_clock::now();
  auto seed = now.time_since_epoch().count();
  srand(static_cast<unsigned int>(seed));      
  int n = rand() % 10 + 1;
  vector<int> a(n);
  for(int i=0;i<n;++i)a[i]=i+1;
  random_device rd;
  mt19937 g(rd());
  shuffle(a.begin(), a.end(), g);
  for(int x:a)cout<<x<<' ';
  cout<<endl;
}
