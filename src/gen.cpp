#include <cstdio>
#include <cstdlib>
#include <ctime>
int main() {
    srand(time(0));                  
    int T = rand() % 10 + 1; 
    printf("%d\n",T);                       
    while (T--) {
        int n = rand() % 100 + 2;    
        printf("%d\n", n);            
        for(int i = 0;i < n;i++){
            int temp = rand() % n + 1;
            printf("%d ", temp);
        }
        printf("\n");
        for(int i = 0;i < n;i++){
            int temp = rand() % n + 1;
            printf("%d ", temp);
        }
        printf("\n");
    }
    return 0;
}