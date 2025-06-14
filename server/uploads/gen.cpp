#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <chrono> 
int main() {
    auto now = std::chrono::high_resolution_clock::now();
    auto seed = now.time_since_epoch().count();
    srand(static_cast<unsigned int>(seed));                  
    int a = rand() % 100 + 1;
    int b = rand() % 100 + 1;
    printf("%d %d",a,b);                       
    
    return 0;
}