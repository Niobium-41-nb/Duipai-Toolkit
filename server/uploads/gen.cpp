#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <chrono> 
int main() {
    auto now = std::chrono::high_resolution_clock::now();
    auto seed = now.time_since_epoch().count();
    srand(static_cast<unsigned int>(seed));                  
    int T = rand() % 1 + 1; 
    printf("%d\n",T);                       
    while (T--) {
        int n = rand() % 10 + 2;    
        printf("%d\n", n);            
        for(int i = 0;i < n;i++){
            int temp = rand() % n + 1;
            printf("%d ", temp);
        }
        printf("\n");
    }
    return 0;
}
