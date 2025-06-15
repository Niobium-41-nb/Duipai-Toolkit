#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <chrono> 
#include <iostream>
using namespace std;
int main() {
  int n = rand() % 10 + 1;
  for (int i = 0; i < n; ++i) cout << (rand()%100) << ' ';
  cout << endl;
}
