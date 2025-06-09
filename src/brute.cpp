//#pragma GCC target("avx2")
#pragma GCC optimize("O3")
#pragma GCC optimize("unroll-loops")
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef long double ld;
typedef vector<int> vi;
typedef vector<ll> vl;
typedef vector<vl> vvl;
typedef vector<vvl> vvvl;
typedef vector<vvvl> vvvvl;
typedef pair<ll,ll> pl;
typedef pair<ll,pl> ppl;
typedef pair<ll,ppl> pppl;
typedef pair<ll,pppl> ppppl;
typedef vector<bool> vb;
typedef vector<vb> vvb;
typedef vector<vvb> vvvb;
typedef vector<vvvb> vvvvb;
#define rep(i,a,b) for(ll i=(a);i<(b);i++)
#define rrep(i,a,b) for(ll i=(b)-1;i>=(a);i--)
#define all(a) begin(a),end(a)
#define sz(a) (ll)(a).size()
#define f first
#define s second
#define ub(x,y) (ll)(upper_bound(all(x),y)-x.begin())
#define lb(x,y) (ll)(lower_bound(all(x),y)-x.begin())
#define cou(x,y) (ll)(upper_bound(all(x),y)-lower_bound(all(x),y))
template<typename T>using min_priority_queue=priority_queue<T,vector<T>,greater<T>>;
template<typename T1,typename T2>ostream&operator<<(ostream&os,pair<T1,T2>&p){os<<p.f<<" "<<p.s;return os;}
template<typename T1,typename T2>istream&operator>>(istream&is,pair<T1,T2>&p){is>>p.f>>p.s;return is;}
template<typename T>ostream&operator<<(ostream&os,vector<T>&v){rep(i,0,sz(v))os<<v[i]<<(i+1!=sz(v)?" ":"");return os;}
template<typename T>istream&operator>>(istream&is,vector<T>&v){for(T&in:v)is>>in;return is;}
template<class T>bool chmax(T&a,T b){if(a<b){a=b;return 1;}return 0;}
template<class T>bool chmin(T&a,T b){if(b<a){a=b;return 1;}return 0;}
//const ll mod=998244353;
const ll mod=1000000007;
ll pow_mod(ll a,ll n,ll mod){
    a%=mod;
    ll res=1;
    while(n){
        if(n%2)res=res*a%mod;
        a=a*a%mod;n/=2;
    }
    res%=mod;
    if(res<0)res+=mod;
    return res;
}
ll inv_mod(ll a,ll mod){return pow_mod(a,mod-2,mod);}
template<const ll mod=998244353>
struct modint{
  using mint=modint<mod>;
  ll x;
  modint(ll _x=0):x(_x%mod){if(x<0)x+=mod;}
  long long int val(){return x;}
  mint&operator=(const mint&a){x=a.x;return *this;}
  mint&operator+=(const mint&a){x+=a.x;if(x>=mod)x-=mod;return *this;}
  mint&operator-=(const mint&a){x-=a.x;if(x<0)x+=mod;return *this;}
  mint&operator*=(const mint&a){x*=a.x;x%=mod;return *this;}
  friend mint operator+(const mint&a,const mint&b){return mint(a)+=b;}
  friend mint operator-(const mint&a,const mint&b){return mint(a)-=b;}
  friend mint operator*(const mint&a,const mint&b){return mint(a)*=b;}
  mint operator-()const{return mint(0)-*this;}
  mint pow(long long int n){
    if(!n)return 1;
    mint a=1;
    mint _x=x;
    while(n){
      if(n&1)a*=_x;
      _x=_x*_x;n>>=1;
    }
    return a;
  }
  mint inv(){return pow(mod-2);}
  mint&operator/=(mint&a){return *this*=a.inv();}
  friend mint operator/(const mint&a,mint b){return mint(a)/=b;}
};
using mint=modint<mod>;
typedef vector<mint> vm;
typedef vector<vm> vvm;
typedef vector<vvm> vvvm;
typedef vector<vvvm> vvvvm;
template<class S,S(*op)(S,S),S(*e)()>
struct segtree{
  private:
  int N,sz;
  vector<S>seg;
  public:
  segtree(int _N){init(_N);}
  void init(int _N){
    sz=_N;
    N=1;
    while(N<_N)N<<=1;
    seg.assign(2*N,e());
  }
  void set(int i,S x){
    assert(0<=i&&i<N);
    i+=N;
    seg[i]=x;
    while(i>1){
      i>>=1;
      seg[i]=op(seg[2*i],seg[2*i+1]);
    }
  }
  S get(int i){
    assert(0<=i&&i<N);
    return seg[i+N];
  }
  S prod(int l,int r){
    assert(0<=l&&l<=r&&r<=N);
    l+=N;r+=N;
    S L=e(),R=e();
    while(l<r){
      if(l&1)L=op(L,seg[l]),l++;
      if(r&1)r--,R=op(seg[r],R);
      l>>=1;
      r>>=1;
    }
    return op(L,R);
  }
  template<typename F>int max_right(int l,F f){
    if(l==sz)return sz;
    l+=N;
    S p=e();
    while(1){
      if(l%2){
        if(!f(op(p,seg[l])))break;
        if(!(l&(l+1)))return sz;
        p=op(p,seg[l]);
        l++;
      }
      l/=2;
    }
    while(l<N){
      if(f(op(p,seg[2*l]))){
        p=op(p,seg[2*l]);l=2*l+1;
      }
      else l=2*l;
    }
    return min(sz,l-N);
  }
  template<typename F>int min_left(int r,F f){
    if(!r)return 0;
    r+=N;
    S p=e();
    while(1){
      if(r%2){
        r--;
        if(!f(op(seg[r],p)))break;
        if(!(r&(r-1)))return 0;
        p=op(seg[r],p);
      }
      r/=2;
    }
    while(r<N){
      if(f(op(seg[2*r+1],p))){
        p=op(seg[2*r+1],p);r=2*r;
      }
      else r=2*r+1;
    }
    return r+1-N;
  }
};
template<class S,S(*op)(S,S),S(*e)(),class T,S(*mapping)(T,S),T(*composition)(T,T),T(*id)()>
struct lazy_segtree{
  private:
  int N,h,sz;
  vector<S>seg;
  vector<T>laz;
  void update(int k){seg[k]=op(seg[2*k],seg[2*k+1]);}
  void all_apply(int k,T f){
    seg[k]=mapping(f,seg[k]);
    if(k<N)laz[k]=composition(f,laz[k]);
  }
  void push(int k){
    all_apply(2*k,laz[k]);
    all_apply(2*k+1,laz[k]);
    laz[k]=id();
  }
  public:
  lazy_segtree(int _N){init(_N);}
  void init(int _N){
    sz=_N;
    N=1,h=0;
    while(N<_N)N<<=1,h++;
    seg.assign(2*N,e());
    laz.assign(2*N,id());
  }
  void set(int i,S x){
    assert(0<=i&&i<N);
    i+=N;
    for(int k=h;k>0;k--)push(i>>k);
    seg[i]=x;
    for(int v=i>>1;v;v>>=1)update(v);
  }
  S get(int i){
    assert(0<=i&&i<N);
    i+=N;
    for(int k=h;k>0;k--)push(i>>k);
    for(int v=i>>1;v;v>>=1)update(v);
    return seg[i];
  }
  S prod(int l,int r){
    assert(0<=l&&l<=r&&r<=N);
    if(l==r)return e();
    l+=N;r+=N;
    for(int k=h;k>0;k--)push(l>>k);
    for(int v=l>>1;v;v>>=1)update(v);
    for(int k=h;k>0;k--)push((r-1)>>k);
    for(int v=(r-1)>>1;v;v>>=1)update(v);
    S L=e(),R=e();
    while(l<r){
      if(l&1)L=op(L,seg[l]),l++;
      if(r&1)r--,R=op(seg[r],R);
      l>>=1;
      r>>=1;
    }
    return op(L,R);
  }
  void apply(int l,int r,T f){
    assert(0<=l&&l<=r&&r<=N);
    if(l==r)return;
    l+=N;r+=N;
    for(int k=h;k>0;k--)push(l>>k);
    for(int v=l>>1;v;v>>=1)update(v);
    for(int k=h;k>0;k--)push((r-1)>>k);
    for(int v=(r-1)>>1;v;v>>=1)update(v);
    int _l=l,_r=r;
    while(l<r){
      if(l&1)all_apply(l++,f);
      if(r&1)all_apply(--r,f);
      l>>=1;
      r>>=1;
    }
    l=_l;r=_r;
    for(int k=h;k>0;k--)push(l>>k),push((r-1)>>k);
    for(int v=l>>1;v;v>>=1)update(v);
    for(int k=h;k>0;k--)push((r-1)>>k);
    for(int v=(r-1)>>1;v;v>>=1)update(v);
  }
  template<typename F>int max_right(int l,F f){
    if(l==sz)return sz;
    l+=N;
    for(int k=h;k>0;k--)push(l>>k);
    for(int v=l>>1;v;v>>=1)update(v);
    S p=e();
    while(1){
      if(l%2){
        if(!f(op(p,seg[l])))break;
        if(!(l&(l+1)))return sz;
        p=op(p,seg[l]);
        l++;
      }
      l/=2;
    }
    while(l<N){
      push(l);
      if(f(op(p,seg[2*l]))){
        p=op(p,seg[2*l]);l=2*l+1;
      }
      else l=2*l;
    }
    return min(sz,l-N);
  }
  template<typename F>int min_left(int r,F f){
    if(!r)return 0;
    r+=N;
    for(int k=h;k>0;k--)push((r-1)>>k);
    for(int v=(r-1)>>1;v;v>>=1)update(v);
    S p=e();
    while(1){
      if(r%2){
        r--;
        if(!f(op(seg[r],p)))break;
        if(!(r&(r-1)))return 0;
        p=op(seg[r],p);
      }
      r/=2;
    }
    while(r<N){
      push(r);
      if(f(op(seg[2*r+1],p))){
        p=op(seg[2*r+1],p);r=2*r;
      }
      else r=2*r+1;
    }
    return r+1-N;
  }
};
class dsu{
  private:
  vector<int>par;
  public:
  dsu()=default;
	explicit dsu(int n):par(n,-1){}
	int leader(int i){
	  while(par[i]>=0)i=par[i];
	  return i;
	}
	int merge(int a,int b){
		a=leader(a);
		b=leader(b);
		if(a!=b){
		  if(par[a]>par[b])swap(a,b);
		  par[a]+=par[b];
		  par[b]=a;
		}
		return a;
	}
	bool same(int a,int b){return(leader(a)==leader(b));}
	int size(int i){return -par[leader(i)];}
	vector<vector<int>>groups(){
	  int n=sz(par);
	  vector<vector<int>>A(n);
	  rep(i,0,n)A[leader(i)].emplace_back(i);
	  vector<vector<int>>res;
	  for(auto a:A)if(!a.empty())res.emplace_back(a);
	  return res;
	}
};
template<typename T>
struct fenwick_tree{
  private:
  vector<T>tree;
  T sum_from_zero(int i){
    T s=0;
    while(i){
      s+=tree[i-1];
      i&=i-1;
    }
    return s;
  }
  public:
  fenwick_tree(int N):tree(vector<T>(N)){}
  T sum(int l,int r){
    assert(0<=l&&l<=r&&r<=sz(tree));
    return sum_from_zero(r)-sum_from_zero(l);
  }
  T get(int i){
    assert(0<=i&&i<sz(tree));
    return sum(i,i+1);
  }
  void add(int i,T x){
    assert(0<=i&&i<sz(tree));
    while(i<sz(tree)){
      tree[i]+=x;
      i|=i+1;
    }
  }
};
int main(){
    cin.tie(0)->sync_with_stdio(0);
    int _=1;cin>>_;
    while(_--){
      ll N;cin>>N;
      vl A(N);cin>>A;
      vl B(N);cin>>B;
      rep(i,0,N)if(i%2)swap(A[i],B[i]);
      ll ans=0;
      set<ll>S;
      rrep(i,0,N){
        if(S.count(A[i]))chmax(ans,i+1);
        if(i+1<N)S.insert(A[i+1]);
      }
      S.clear();
      rrep(i,0,N){
        if(S.count(B[i]))chmax(ans,i+1);
        if(i+1<N)S.insert(B[i+1]);
      }
      S.clear();
      rrep(i,0,N){
        S.insert(A[i]);
        if(S.count(B[i]))chmax(ans,i+1);
      }
      S.clear();
      swap(A,B);
      rrep(i,0,N){
        S.insert(A[i]);
        if(S.count(B[i]))chmax(ans,i+1);
      }
      cout<<ans<<endl;
    }
    return 0;
}