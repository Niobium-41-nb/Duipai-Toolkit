#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <chrono> 
#include <iostream>
using namespace std;
int main() {
  auto now = std::chrono::high_resolution_clock::now();
  auto seed = now.time_since_epoch().count();
  srand(static_cast<unsigned int>(seed));      
  int n = rand() % 10 + 1;
  for (int i = 0; i < n; ++i) cout << (rand()%100) << ' ';
  cout << endl;
}
