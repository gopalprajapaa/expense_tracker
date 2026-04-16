import { Layout, theme } from "antd";

const { Header, Footer, Content } = Layout;

const Homelayout = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="!bg-[#FF735C] flex items-center justify-center">
        <h1 className="text-white text-lg md:text-3xl font-bold text-center">
          Expense Tracker App
        </h1>
      </Header>

      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
      </Content>

      <Footer className="!bg-[#FF735C] relative overflow-hidden py-10 mt-auto border-t border-white/10 shadow-inner">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:14px_24px] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center transform transition-transform hover:scale-110 hover:rotate-3 duration-300">
                <span className="text-[#FF735C] text-xl font-black">$</span>
              </div>
              <h2 className="text-white text-2xl font-bold tracking-tight m-0 drop-shadow-md">
                Expense Tracker
              </h2>
            </div>
            
            <p className="text-white/90 font-medium max-w-md mx-auto text-sm leading-relaxed">
              Take control of your finances. Track, analyze, and optimize your spending habits with ease and clarity.
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-white/80 font-semibold bg-black/10 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="w-1 h-1 rounded-full bg-white/50"></span>
              <span>All rights reserved.</span>
            </div>
            
            <div className="flex space-x-6 mt-2">
              {['About', 'Privacy', 'Terms', 'Contact'].map((item) => (
                <a key={item} href="#" className="text-white/70 hover:text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5">
                  {item}
                </a>
              ))}
            </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Homelayout;