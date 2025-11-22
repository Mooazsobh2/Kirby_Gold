// App.tsx
import React, { useState, FormEvent } from "react";

type UserRole = "trader" | "jeweler";

interface User {
  name: string;
  role: UserRole;
}

type PageId =
  | "dashboard"
  | "live-prices"
  | "charts"
  | "metatrader"
  | "price-locks"
  | "map"
  | "wallet"
  | "marketplace"
  | "directory"
  | "settings";

interface NavItem {
  id: PageId;
  label: string;
  section: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "لوحة التحكم", section: "عام" },

  { id: "live-prices", label: "الأسعار اللحظية", section: "التداول" },
  { id: "charts", label: "الرسوم البيانية", section: "التداول" },
  { id: "metatrader", label: "واجهة MetaTrader", section: "التداول" },
  { id: "price-locks", label: "تثبيت الأسعار", section: "التداول", badge: "جديد" },

  { id: "map", label: "الخريطة و المحلات", section: "الشبكة" },
  { id: "directory", label: "دليل التجار و الصاغة", section: "الشبكة" },

  { id: "marketplace", label: "سوق المنتجات", section: "المالية", badge: "جديد" },
  { id: "wallet", label: "المحفظة", section: "المالية" },

  { id: "settings", label: "الإعدادات", section: "النظام" },
];

const sectionsOrder = ["عام", "التداول", "الشبكة", "المالية", "النظام"];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<PageId>("dashboard");

  // لو ما في مستخدم → نعرض شاشة تسجيل الدخول
  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-800 bg-slate-900/70 backdrop-blur-md hidden md:flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-amber-400/70">
              KIRBY
            </div>
            <div className="text-xl font-bold tracking-tight">
              Gold <span className="text-amber-400">Suite</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg">
            ♛
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {sectionsOrder.map((section) => {
            const items = navItems.filter((n) => n.section === section);
            if (!items.length) return null;
            return (
              <div key={section} className="space-y-2">
                <div className="px-2 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  {section}
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
                    const active = page === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setPage(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition
                          ${
                            active
                              ? "bg-amber-500/10 text-amber-200 border border-amber-400/40 shadow-[0_0_24px_rgba(245,158,11,0.25)]"
                              : "text-slate-300 hover:bg-slate-800/70 border border-transparent hover:border-slate-700"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300" />
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
          <div>
            <div className="font-medium text-slate-200">
              {user.role === "trader" ? "حساب التاجر" : "حساب الصائغ"}
            </div>
            <div className="text-[11px] text-slate-500">{user.name}</div>
          </div>
          <button
            className="px-3 py-1.5 rounded-lg text-[11px] border border-slate-700 hover:border-amber-400/60 hover:text-amber-200 transition"
            onClick={() => setUser(null)}
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5">
          {page === "dashboard" && <DashboardPage />}
          {page === "live-prices" && <LivePricesPage />}
          {page === "charts" && <ChartsPage />}
          {page === "metatrader" && <MetaTraderPage />}
          {page === "price-locks" && <PriceLocksPage />}
          {page === "map" && <MapPage />}
          {page === "wallet" && <WalletPage />}
          {page === "marketplace" && <MarketplacePage />}
          {page === "directory" && <DirectoryPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

/* ============================
   AUTH SCREEN (LOGIN)
============================ */
const AuthScreen: React.FC<{ onLogin: (user: User) => void }> = ({
  onLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("يرجى إدخال اسم المستخدم.");
      return;
    }

    if (password !== "12345") {
      setError("بيانات غير صحيحة (للاختبار استخدم كلمة المرور 12345).");
      return;
    }

    let role: UserRole =
      username.includes("صائغ") || username.includes("صياغ")
        ? "jeweler"
        : "trader";

    onLogin({ name: username.trim(), role });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50 text-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/50 flex items-center justify-center text-amber-300 text-xl">
            ♛
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-amber-400/70">
              KIRBY GOLD
            </div>
            <div className="text-lg font-semibold text-slate-100">
              تسجيل الدخول للحساب
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 mb-4">
          <div>للاختبار:</div>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>
              للدخول كـ <span className="text-emerald-300">صائغ</span>: اكتب في
              اسم المستخدم كلمة <span className="font-semibold">"صائغ"</span>{" "}
              مثل:{" "}
              <span className="font-mono text-slate-200">صائغ أحمد</span>
            </li>
            <li>
              كلمة المرور للجميع:{" "}
              <span className="font-mono text-slate-200">12345</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              اسم المستخدم
            </label>
            <input
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400/70"
              placeholder="مثال: صائغ أحمد أو تاجر خالد"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400/70"
              placeholder="12345 للتجربة"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-1 py-2 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition"
          >
            دخول إلى لوحة التحكم
          </button>
        </form>
      </div>
    </div>
  );
};

/* ============================
   TOPBAR
============================ */
const Topbar: React.FC<{ user: User }> = ({ user }) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/70 backdrop-blur flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 flex-1">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>الأسعار محدثة لحظة بلحظة</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden sm:flex text-xs items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-amber-400/60 hover:text-amber-200 transition">
          <span className="text-[10px]">⏰</span>
          <span>تنبيه سعر جديد</span>
        </button>
        <div className="flex items-center gap-3 border border-slate-700 rounded-full px-2 py-1 bg-slate-900/70">
          <div className="text-right mr-1">
            <div className="text-[11px] text-slate-400">
              {user.role === "trader" ? "تاجر" : "صائغ"}
            </div>
            <div className="text-xs font-semibold truncate max-w-[120px]">
              {user.name}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-900 text-sm font-bold">
            {user.role === "trader" ? "TG" : "JG"}
          </div>
        </div>
      </div>
    </header>
  );
};

/* ============================
   DASHBOARD
============================ */
const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة التحكم الرئيسية"
        subtitle="نظرة سريعة على الذهب، الفضة، المحفظة، وطلبات تثبيت الأسعار."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          label="إجمالي قيمة الذهب"
          value="1,245,320"
          suffix="USD"
          trend="+3.2%"
          trendDirection="up"
        />
        <StatsCard
          label="إجمالي قيمة الفضة"
          value="214,580"
          suffix="USD"
          trend="+1.1%"
          trendDirection="up"
        />
        <StatsCard
          label="طلبات تثبيت فعّالة الآن"
          value="17"
          suffix="صفقة"
          trend="+4"
          trendDirection="up"
        />
        <StatsCard
          label="محفظة اليوم"
          value="-2,140"
          suffix="USD"
          trend="-0.7%"
          trendDirection="down"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="سلوك أسعار الذهب و الفضة (آخر 24 ساعة)">
            <ChartPlaceholder />
          </SectionCard>
          <SectionCard title="آخر نشاط في تثبيت الأسعار">
            <ActivityList />
          </SectionCard>
        </div>
        <div className="space-y-4">
          <SectionCard title="ملخص المحفظة">
            <WalletSummary />
          </SectionCard>
          <SectionCard title="حالة السوق الآن">
            <MarketMood />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

/* ============================
   LIVE PRICES
============================ */
const LivePricesPage: React.FC = () => {
  const [tab, setTab] = useState<"gold" | "silver" | "watches">("gold");

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأسعار اللحظية"
        subtitle="متابعة أسعار الذهب، الفضة والساعات لحظة بلحظة مع تمييز حركة السوق."
      />

      <PriceTicker />

      <SectionCard title="اختيار الأصل">
        <div className="flex flex-wrap gap-2">
          <SegmentButton
            active={tab === "gold"}
            onClick={() => setTab("gold")}
            label="الذهب"
            icon="🟡"
          />
          <SegmentButton
            active={tab === "silver"}
            onClick={() => setTab("silver")}
            label="الفضة"
            icon="⚪"
          />
          <SegmentButton
            active={tab === "watches"}
            onClick={() => setTab("watches")}
            label="الساعات"
            icon="⌚"
          />
        </div>
      </SectionCard>

      {tab === "gold" && (
        <SectionCard title="أسعار الذهب حسب العيار">
          <DataTable
            columns={["العيار", "شراء", "بيع", "تغير", "آخر تحديث"]}
            rows={[
              ["24K", "82.15", "82.60", "+0.25%", "قبل 10 ثوان"],
              ["22K", "75.35", "75.80", "+0.19%", "قبل 10 ثوان"],
              ["21K", "71.10", "71.55", "+0.14%", "قبل 10 ثوان"],
              ["18K", "61.70", "62.10", "+0.09%", "قبل 10 ثوان"],
            ]}
          />
        </SectionCard>
      )}

      {tab === "silver" && (
        <SectionCard title="أسعار الفضة">
          <DataTable
            columns={["النوع", "شراء", "بيع", "تغير", "آخر تحديث"]}
            rows={[
              ["999", "1.05", "1.08", "+0.12%", "قبل 8 ثوان"],
              ["925", "0.98", "1.01", "+0.09%", "قبل 8 ثوان"],
            ]}
          />
        </SectionCard>
      )}

      {tab === "watches" && (
        <SectionCard title="مؤشرات أسعار الساعات الفاخرة">
          <DataTable
            columns={["المؤشر", "قيمة المؤشر", "تغير يومي", "تغير شهري"]}
            rows={[
              ["Rolex Index", "134.2", "+0.8%", "+5.2%"],
              ["Omega Index", "101.7", "+0.4%", "+2.1%"],
              ["Patek Index", "189.5", "+1.3%", "+7.8%"],
            ]}
          />
        </SectionCard>
      )}
    </div>
  );
};

/* ============================
   CHARTS
============================ */
const ChartsPage: React.FC = () => {
  const [asset, setAsset] = useState<"gold" | "silver" | "watch">("gold");
  const [timeframe, setTimeframe] = useState<"1H" | "4H" | "1D" | "1W">("1D");

  return (
    <div className="space-y-6">
      <PageHeader
        title="الرسوم البيانية المتقدمة"
        subtitle="واجهة تحليل شبيهة بـ MetaTrader لعرض حركة الذهب والفضة والساعات."
      />

      <SectionCard title="إعدادات الرسم">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <SegmentButton
              active={asset === "gold"}
              onClick={() => setAsset("gold")}
              label="الذهب"
              icon="🟡"
            />
            <SegmentButton
              active={asset === "silver"}
              onClick={() => setAsset("silver")}
              label="الفضة"
              icon="⚪"
            />
            <SegmentButton
              active={asset === "watch"}
              onClick={() => setAsset("watch")}
              label="الساعات"
              icon="⌚"
            />
          </div>
          <div className="flex flex-wrap gap-1 text-xs">
            {(["1H", "4H", "1D", "1W"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] transition ${
                  timeframe === tf
                    ? "border-amber-400/70 bg-amber-400/10 text-amber-200"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="الرسم البياني (Wireframe)">
        <ChartPlaceholder mode="candles" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <MiniStat label="أعلى سعر اليوم" value="2,432.15" />
          <MiniStat label="أدنى سعر اليوم" value="2,396.80" />
          <MiniStat label="تغير يومي" value="+0.91%" />
          <MiniStat label="حجم التداول التقريبي" value="120 كغ" />
        </div>
      </SectionCard>
    </div>
  );
};

/* ============================
   METATRADER-LIKE VIEW
============================ */
const MetaTraderPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="واجهة تداول شبيهة بـ MetaTrader"
        subtitle="دفتر أوامر مبسّط + نموذج أوامر + الصفقات المفتوحة."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="دفتر الأوامر (التجار)">
          <DataTable
            compact
            columns={["التاجر", "نوع", "سعر", "كمية", "مدينة"]}
            rows={[
              ["Gold House", "عرض بيع", "82.45", "5 كغ", "إسطنبول"],
              ["Al Noor", "عرض شراء", "82.20", "2 كغ", "دبي"],
              ["SilverPro", "عرض بيع", "1.06", "20 كغ", "الرياض"],
            ]}
          />
        </SectionCard>

        <SectionCard title="نموذج أمر سريع">
          <TradeForm />
        </SectionCard>

        <SectionCard title="الصفقات المفتوحة">
          <DataTable
            compact
            columns={["الرمز", "النوع", "الكمية", "سعر الدخول", "الربح/الخسارة"]}
            rows={[
              ["XAU-21K", "شراء", "1.2 كغ", "81.90", "+420"],
              ["XAG-999", "شراء", "5 كغ", "1.02", "-35"],
            ]}
          />
        </SectionCard>
      </div>
    </div>
  );
};

/* ============================
   PRICE LOCKS
============================ */
const PriceLocksPage: React.FC = () => {
  const [filter, setFilter] =
    useState<"all" | "pending" | "active" | "completed">("active");

  return (
    <div className="space-y-6">
      <PageHeader
        title="إدارة تثبيت الأسعار"
        subtitle="إرسال واستقبال طلبات تثبيت السعر بينك وبين الصاغة أو التجار."
      />

      <SectionCard title="الفلاتر">
        <div className="flex flex-wrap gap-2">
          <SegmentButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="الكل"
          />
          <SegmentButton
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
            label="قيد الانتظار"
          />
          <SegmentButton
            active={filter === "active"}
            onClick={() => setFilter("active")}
            label="فعّالة"
          />
          <SegmentButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
            label="مكتملة"
          />
        </div>
      </SectionCard>

      <SectionCard title="قائمة طلبات التثبيت">
        <div className="space-y-3 text-xs">
          <LockRow
            trader="Gold House"
            client="محل الياقوت"
            metal="ذهب 21K"
            quantity="1.5 كغ"
            price="81.70"
            status="active"
            expiresIn="03:12"
          />
          <LockRow
            trader="Al Noor"
            client="محل زمرد"
            metal="فضة 999"
            quantity="10 كغ"
            price="1.03"
            status="pending"
            expiresIn="05:00"
          />
          <LockRow
            trader="SilverPro"
            client="محل الأنوار"
            metal="ذهب 24K"
            quantity="0.8 كغ"
            price="82.20"
            status="completed"
            expiresIn="انتهت"
          />
        </div>
      </SectionCard>
    </div>
  );
};

/* ============================
   MAP VIEW
============================ */
const MapPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="الخريطة و مواقع المحلات"
        subtitle="استعرض مواقع التجار ومحلات الصياغة و الساعات على الخريطة."
      />

      <SectionCard title="الخريطة (Wireframe)">
        <MapPlaceholder />
      </SectionCard>

      <SectionCard title="قائمة المحلات القريبة">
        <DataTable
          compact
          columns={["الاسم", "النوع", "المدينة", "المسافة", "الحالة"]}
          rows={[
            ["Gold House", "تاجر جملة", "إسطنبول", "0.8 كم", "متصل الآن"],
            ["محل الياقوت", "صائغ", "إسطنبول", "1.2 كم", "متصل الآن"],
            ["Luxury Time", "محل ساعات", "إسطنبول", "2.3 كم", "غير متصل"],
          ]}
        />
      </SectionCard>
    </div>
  );
};

/* ============================
   WALLET
============================ */
const WalletPage: React.FC = () => {
  const [assetTab, setAssetTab] = useState<"overview" | "gold" | "silver" | "watch">(
    "overview"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="محفظة Kirby Gold"
        subtitle="تابع قيمة الذهب والفضة والساعات لديك مع الربح والخسارة."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <WalletSummaryCard
          label="إجمالي المحفظة"
          value="1,459,900"
          currency="USD"
          diff="+2.1%"
        />
        <WalletSummaryCard
          label="ذهب"
          value="1,245,320"
          currency="USD"
          diff="+3.2%"
        />
        <WalletSummaryCard
          label="فضة + ساعات"
          value="214,580"
          currency="USD"
          diff="+0.9%"
        />
      </div>

      <SectionCard title="تفاصيل المحفظة">
        <div className="flex flex-wrap gap-2 mb-4">
          <SegmentButton
            active={assetTab === "overview"}
            onClick={() => setAssetTab("overview")}
            label="نظرة عامة"
          />
          <SegmentButton
            active={assetTab === "gold"}
            onClick={() => setAssetTab("gold")}
            label="الذهب"
          />
          <SegmentButton
            active={assetTab === "silver"}
            onClick={() => setAssetTab("silver")}
            label="الفضة"
          />
          <SegmentButton
            active={assetTab === "watch"}
            onClick={() => setAssetTab("watch")}
            label="الساعات"
          />
        </div>

        {assetTab === "overview" && (
          <DataTable
            columns={["الأصل", "الكمية", "سعر الشراء", "القيمة الحالية", "الربح/الخسارة"]}
            rows={[
              ["ذهب 24K", "2.1 كغ", "80.10", "82.40", "+4.5%"],
              ["ذهب 21K", "3.4 كغ", "78.30", "81.10", "+3.6%"],
              ["فضة 999", "20 كغ", "0.99", "1.04", "+5.0%"],
              ["Rolex Index", "-", "-", "134.2", "+5.2%"],
            ]}
          />
        )}

        {assetTab === "gold" && (
          <DataTable
            columns={["العيار", "الكمية", "متوسط سعر الشراء", "القيمة الحالية", "الربح/الخسارة"]}
            rows={[
              ["24K", "2.1 كغ", "80.10", "82.40", "+4.5%"],
              ["21K", "3.4 كغ", "78.30", "81.10", "+3.6%"],
              ["18K", "0.9 كغ", "65.20", "66.10", "+1.4%"],
            ]}
          />
        )}

        {assetTab === "silver" && (
          <DataTable
            columns={["النوع", "الكمية", "متوسط سعر الشراء", "القيمة الحالية", "الربح/الخسارة"]}
            rows={[
              ["999", "12 كغ", "0.98", "1.04", "+6.1%"],
              ["925", "8 كغ", "0.91", "0.96", "+4.2%"],
            ]}
          />
        )}

        {assetTab === "watch" && (
          <DataTable
            columns={["الماركة / المؤشر", "عدد القطع", "القيمة التقريبية", "تغير شهري"]}
            rows={[
              ["Rolex", "8", "89,000", "+4.2%"],
              ["Omega", "6", "37,500", "+2.9%"],
            ]}
          />
        )}
      </SectionCard>

      <SectionCard title="سجل الحركات">
        <DataTable
          compact
          columns={["التاريخ", "النوع", "الأصل", "الكمية", "السعر", "مرتبطة بتثبيت؟"]}
          rows={[
            ["2025-11-15", "شراء", "ذهب 24K", "1.0 كغ", "81.60", "نعم"],
            ["2025-11-14", "شراء", "فضة 999", "5 كغ", "1.02", "نعم"],
            ["2025-11-13", "تعديل", "Rolex Index", "-", "-", "لا"],
          ]}
        />
      </SectionCard>
    </div>
  );
};

/* ============================
   MARKETPLACE – سوق المنتجات
============================ */

type ProductType = "gold" | "silver" | "watch";

const MarketplacePage: React.FC = () => {
  const [tab, setTab] = useState<"all" | ProductType>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);

  const products = [
    {
      id: 1,
      type: "gold" as ProductType,
      jeweler: "محل الياقوت",
      title: "طقم ذهب 21K تركي",
      price: "2,450",
      currency: "USD",
      city: "إسطنبول",
      aiEnhanced: true,
      featured: true,
    },
    {
      id: 2,
      type: "watch" as ProductType,
      jeweler: "Luxury Time",
      title: "Rolex Submariner",
      price: "9,800",
      currency: "USD",
      city: "دبي",
      aiEnhanced: true,
      featured: false,
    },
    {
      id: 3,
      type: "silver" as ProductType,
      jeweler: "فضة الشام",
      title: "سلسال فضة 925",
      price: "120",
      currency: "USD",
      city: "عمّان",
      aiEnhanced: false,
      featured: false,
    },
    {
      id: 4,
      type: "gold" as ProductType,
      jeweler: "محل زمرد",
      title: "سوار ذهب 18K إيطالي",
      price: "780",
      currency: "USD",
      city: "الرياض",
      aiEnhanced: true,
      featured: false,
    },
  ];

  const filteredProducts =
    tab === "all" ? products : products.filter((p) => p.type === tab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="سوق المنتجات"
        subtitle="كل صائغ يمكنه نشر صور قطع الذهب والفضة والساعات مع تحسين الصور بالذكاء الاصطناعي."
      />

      <SectionCard title="الفلترة و الخيارات">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <SegmentButton
              active={tab === "all"}
              onClick={() => setTab("all")}
              label="الكل"
            />
            <SegmentButton
              active={tab === "gold"}
              onClick={() => setTab("gold")}
              label="ذهب"
              icon="🟡"
            />
            <SegmentButton
              active={tab === "silver"}
              onClick={() => setTab("silver")}
              label="فضة"
              icon="⚪"
            />
            <SegmentButton
              active={tab === "watch"}
              onClick={() => setTab("watch")}
              label="ساعات"
              icon="⌚"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setView("grid")}
              className={`px-2.5 py-1 rounded-lg border ${
                view === "grid"
                  ? "border-amber-400/70 bg-amber-500/10 text-amber-200"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              شبكة
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-2.5 py-1 rounded-lg border ${
                view === "list"
                  ? "border-amber-400/70 bg-amber-500/10 text-amber-200"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              قائمة
            </button>

            <button
              onClick={() => setUploadOpen(true)}
              className="ml-2 px-3 py-1.5 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-[11px] font-semibold transition"
            >
              + إضافة منتج جديد
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="المنتجات المنشورة">
        {view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {filteredProducts.map((p) => (
              <ProductRow key={p.id} {...p} />
            ))}
          </div>
        )}
      </SectionCard>

      {uploadOpen && (
        <UploadProductModal onClose={() => setUploadOpen(false)} />
      )}
    </div>
  );
};

/* ============================
   DIRECTORY
============================ */
const DirectoryPage: React.FC = () => {
  const [tab, setTab] = useState<"traders" | "jewelers">("traders");

  return (
    <div className="space-y-6">
      <PageHeader
        title="دليل التجار و الصاغة"
        subtitle="اعثر على أفضل التجار ومحلات الصياغة والساعات للتعاون والتداول."
      />

      <SectionCard title="اختيار نوع الدليل">
        <div className="flex flex-wrap gap-2">
          <SegmentButton
            active={tab === "traders"}
            onClick={() => setTab("traders")}
            label="تجار الجملة"
          />
          <SegmentButton
            active={tab === "jewelers"}
            onClick={() => setTab("jewelers")}
            label="محلات الصياغة / الساعات"
          />
        </div>
      </SectionCard>

      <SectionCard
        title={
          tab === "traders" ? "تجار الجملة الموثوقين" : "محلات الصياغة والساعات"
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <ShopCard
            name="Gold House"
            type={tab === "traders" ? "تاجر جملة" : "صائغ"}
            city="إسطنبول"
            rating={4.8}
            locks="+120 تثبيت"
          />
          <ShopCard
            name="Al Noor"
            type={tab === "traders" ? "تاجر جملة" : "صائغ"}
            city="دبي"
            rating={4.6}
            locks="+95 تثبيت"
          />
          <ShopCard
            name="Luxury Time"
            type={tab === "traders" ? "مزود ساعات" : "محل ساعات"}
            city="الرياض"
            rating={4.4}
            locks="+40 تثبيت"
          />
        </div>
      </SectionCard>
    </div>
  );
};

/* ============================
   SETTINGS
============================ */
const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="إعدادات الحساب و النظام"
        subtitle="تحكم بالعملة الافتراضية، الإشعارات، وبياناتك الشخصية."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="بيانات الحساب">
          <div className="space-y-3 text-xs">
            <FieldRow label="اسم الحساب" value="Al-Kirby Gold" />
            <FieldRow label="نوع الحساب" value="تاجر جملة (Premium)" />
            <FieldRow label="البريد الإلكتروني" value="trader@example.com" />
            <FieldRow label="المدينة" value="إسطنبول" />
          </div>
        </SectionCard>

        <SectionCard title="إعدادات السوق">
          <div className="space-y-3 text-xs">
            <FieldRow label="العملة الافتراضية" value="USD" />
            <FieldRow label="نطاق تنبيه حركة الذهب" value="± 1.5%" />
            <FieldRow label="وقت صلاحية تثبيت السعر" value="5 دقائق" />
          </div>
        </SectionCard>

        <SectionCard title="الإشعارات">
          <div className="space-y-3 text-xs">
            <ToggleRow label="تنبيه عند تجاوز الذهب حد معين" enabled />
            <ToggleRow label="تنبيه طلب تثبيت جديد" enabled />
            <ToggleRow label="تلخيص يومي لحالة المحفظة" enabled />
          </div>
        </SectionCard>

        <SectionCard title="أمان الحساب">
          <div className="space-y-3 text-xs">
            <ToggleRow label="تفعيل التحقق بخطوتين (2FA)" enabled />
            <ToggleRow label="إرسال تنبيه عند تسجيل دخول جديد" enabled />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

/* ============================
   SMALL REUSABLE COMPONENTS
============================ */

const PageHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="flex flex-col gap-1 mb-2">
    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
      {title}
    </h1>
    {subtitle && (
      <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">{subtitle}</p>
    )}
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg shadow-black/30 mb-1">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
    </div>
    {children}
  </section>
);

const StatsCard: React.FC<{
  label: string;
  value: string;
  suffix?: string;
  trend?: string;
  trendDirection?: "up" | "down";
}> = ({ label, value, suffix, trend, trendDirection }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-black/30">
    <div className="text-[11px] text-slate-400 mb-1">{label}</div>
    <div className="text-lg font-semibold text-slate-50">
      {value}
      {suffix && (
        <span className="text-[11px] text-slate-400 ml-1">{suffix}</span>
      )}
    </div>
    {trend && (
      <div
        className={`mt-1 text-[11px] ${
          trendDirection === "down" ? "text-red-400" : "text-emerald-400"
        }`}
      >
        {trendDirection === "down" ? "▼" : "▲"} {trend}
      </div>
    )}
  </div>
);

const DataTable: React.FC<{
  columns: string[];
  rows: (string | number)[][];
  compact?: boolean;
}> = ({ columns, rows, compact }) => (
  <div className="overflow-x-auto text-xs">
    <table className="min-w-full border-separate border-spacing-y-1">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="text-right text-[11px] text-slate-400 font-medium pb-2 pr-2"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                key={j}
                className={`bg-slate-900/80 border border-slate-800 first:rounded-l-xl last:rounded-r-xl px-3 ${
                  compact ? "py-1.5" : "py-2.5"
                } whitespace-nowrap`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PriceTicker: React.FC = () => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden text-[11px] flex">
    <div className="bg-amber-500/15 text-amber-200 px-3 py-2 border-l border-amber-400/40 flex items-center gap-1">
      <span className="text-xs">⚡</span>
      <span>تيكر السوق</span>
    </div>
    <div className="flex-1 flex items-center overflow-hidden">
      <div className="animate-pulse whitespace-nowrap px-4 flex gap-6">
        <span>ذهب 24K: 82.60 ▲ 0.25%</span>
        <span>ذهب 21K: 71.55 ▲ 0.14%</span>
        <span>فضة 999: 1.08 ▲ 0.12%</span>
        <span>Rolex Index: 134.2 ▲ 0.8%</span>
      </div>
    </div>
  </div>
);

const SegmentButton: React.FC<{
  active: boolean;
  label: string;
  icon?: string;
  onClick?: () => void;
}> = ({ active, label, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] border transition ${
      active
        ? "border-amber-400/70 bg-amber-500/10 text-amber-200"
        : "border-slate-700 text-slate-300 hover:border-slate-500"
    }`}
  >
    {icon && <span>{icon}</span>}
    <span>{label}</span>
  </button>
);

const ChartPlaceholder: React.FC<{ mode?: "line" | "candles" }> = ({
  mode = "line",
}) => (
  <div className="h-64 md:h-80 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 flex items-center justify-center text-xs text-slate-500">
    {mode === "candles"
      ? "منطقة رسم بياني (شموع) – جاهزة للدمج مع أي مكتبة Charts"
      : "منطقة رسم بياني (خطية) – جاهزة للدمج مع أي مكتبة Charts"}
  </div>
);

const MiniStat: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
    <div className="text-[11px] text-slate-400 mb-1">{label}</div>
    <div className="text-sm font-semibold text-slate-100">{value}</div>
  </div>
);

const ActivityList: React.FC = () => (
  <div className="space-y-2 text-xs">
    {[
      "تم قبول تثبيت 1.0 كغ ذهب 24K مع محل الياقوت.",
      "تم إرسال طلب تثبيت 5 كغ فضة 999 إلى SilverPro.",
      "تم إغلاق صفقة ذهب 21K بربح +320 USD.",
    ].map((text, i) => (
      <div
        key={i}
        className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>{text}</span>
      </div>
    ))}
  </div>
);

const WalletSummary: React.FC = () => (
  <div className="space-y-2 text-xs">
    <div className="flex items-center justify-between">
      <span className="text-slate-400">إجمالي المحفظة</span>
      <span className="font-semibold text-slate-100">1,459,900 USD</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-slate-400">ذهب</span>
      <span className="text-amber-200">1,245,320 USD</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-slate-400">فضة + ساعات</span>
      <span className="text-sky-200">214,580 USD</span>
    </div>
  </div>
);

const MarketMood: React.FC = () => (
  <div className="space-y-2 text-xs">
    <div className="flex items-center justify-between">
      <span className="text-slate-400">مزاج سوق الذهب</span>
      <span className="text-emerald-400">صاعد</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-slate-400">تقلب اليوم</span>
      <span className="text-slate-100">1.2%</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-slate-400">نشاط تثبيت الأسعار</span>
      <span className="text-amber-300">مرتفع</span>
    </div>
  </div>
);

const TradeForm: React.FC = () => (
  <form className="space-y-3 text-xs">
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">النوع</label>
        <select className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs">
          <option>ذهب 24K</option>
          <option>ذهب 21K</option>
          <option>فضة 999</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          نوع العملية
        </label>
        <select className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs">
          <option>شراء</option>
          <option>بيع</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">الكمية</label>
        <input
          className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs"
          placeholder="مثال: 1.5"
        />
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          السعر (اختياري)
        </label>
        <input
          className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs"
          placeholder="أو اتركه لسعر السوق"
        />
      </div>
    </div>
    <button
      type="button"
      className="w-full mt-1 py-2 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition"
    >
      إنشاء أمر تجريبي (Wireframe فقط)
    </button>
  </form>
);

const LockRow: React.FC<{
  trader: string;
  client: string;
  metal: string;
  quantity: string;
  price: string;
  status: "pending" | "active" | "completed";
  expiresIn: string;
}> = ({ trader, client, metal, quantity, price, status, expiresIn }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <div className="flex flex-col text-xs">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-100">{metal}</span>
        <span className="text-[11px] text-slate-400">{quantity}</span>
      </div>
      <div className="text-[11px] text-slate-400">
        {trader} ← {client}
      </div>
    </div>
    <div className="flex items-center gap-3 text-xs">
      <div className="text-[11px] text-slate-300">سعر: {price}</div>
      <div className="text-[11px] text-slate-400">ينتهي بعد: {expiresIn}</div>
      <LockStatusBadge status={status} />
    </div>
  </div>
);

const MapPlaceholder: React.FC = () => (
  <div className="h-72 rounded-xl border border-dashed border-slate-700 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-xs text-slate-500">
    منطقة خريطة – جاهزة للدمج مع Google Maps أو Mapbox
  </div>
);

const WalletSummaryCard: React.FC<{
  label: string;
  value: string;
  currency: string;
  diff: string;
}> = ({ label, value, currency, diff }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
    <div className="text-[11px] text-slate-400 mb-1">{label}</div>
    <div className="text-lg font-semibold text-slate-100">
      {value}{" "}
      <span className="text-[10px] text-slate-500 align-middle">
        {currency}
      </span>
    </div>
    <div
      className={`mt-1 text-[11px] ${
        diff.startsWith("-") ? "text-red-400" : "text-emerald-400"
      }`}
    >
      {diff.startsWith("-") ? "▼" : "▲"} {diff} اليوم
    </div>
  </div>
);

const ShopCard: React.FC<{
  name: string;
  type: string;
  city: string;
  rating: number;
  locks: string;
}> = ({ name, type, city, rating, locks }) => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-slate-100">{name}</div>
        <div className="text-[11px] text-slate-400">
          {type} · {city}
        </div>
      </div>
      <div className="text-[11px] text-amber-300">
        ⭐ {rating.toFixed(1)}
      </div>
    </div>
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span>{locks}</span>
      <button className="px-2 py-1 rounded-lg border border-slate-700 hover:border-amber-400/60 hover:text-amber-200 transition">
        عرض التفاصيل
      </button>
    </div>
  </div>
);

const FieldRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <span className="text-slate-100">{value}</span>
  </div>
);

const ToggleRow: React.FC<{ label: string; enabled?: boolean }> = ({
  label,
  enabled,
}) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-300">{label}</span>
    <button
      className={`w-9 h-5 rounded-full flex items-center px-0.5 text-[9px] transition ${
        enabled
          ? "bg-emerald-500/80 justify-end"
          : "bg-slate-700 justify-start"
      }`}
      type="button"
    >
      <span className="w-4 h-4 rounded-full bg-slate-950" />
    </button>
  </div>
);

const LockStatusBadge: React.FC<{
  status: "pending" | "active" | "completed";
}> = ({ status }) => {
  let text = "";
  let cls = "";
  if (status === "pending") {
    text = "قيد الانتظار";
    cls = "bg-amber-500/15 text-amber-200 border-amber-400/40";
  } else if (status === "active") {
    text = "فعّالة";
    cls = "bg-emerald-500/15 text-emerald-200 border-emerald-400/40";
  } else {
    text = "مكتملة";
    cls = "bg-slate-700/40 text-slate-200 border-slate-500/60";
  }
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] border ${cls}`}>
      {text}
    </span>
  );
};

/* ============================
   PRODUCT COMPONENTS + UPLOAD
============================ */

interface ProductProps {
  type: ProductType;
  jeweler: string;
  title: string;
  price: string;
  currency: string;
  city: string;
  aiEnhanced: boolean;
  featured?: boolean;
}

const ProductCard: React.FC<ProductProps> = ({
  type,
  jeweler,
  title,
  price,
  currency,
  city,
  aiEnhanced,
  featured,
}) => {
  const typeLabel =
    type === "gold" ? "ذهب" : type === "silver" ? "فضة" : "ساعة فاخرة";

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col text-xs shadow-lg shadow-black/40">
      <div className="h-32 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        <span className="text-slate-500 text-[11px]">
          صورة المنتج (سيتم استبدالها من الـ API)
        </span>
        {featured && (
          <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 font-semibold">
            مميز
          </span>
        )}
        {aiEnhanced && (
          <span className="absolute bottom-2 right-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/50">
            محسّن بالذكاء الاصطناعي
          </span>
        )}
      </div>

      <div className="p-3 space-y-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">{typeLabel}</span>
          <span className="text-[11px] text-slate-400">{city}</span>
        </div>
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        <div className="flex items-center justify-between mt-auto">
          <div className="text-[13px] font-semibold text-amber-300">
            {price}{" "}
            <span className="text-[10px] text-slate-400">{currency}</span>
          </div>
          <div className="text-[11px] text-slate-400">{jeweler}</div>
        </div>
      </div>
    </div>
  );
};

const ProductRow: React.FC<ProductProps> = ({
  type,
  jeweler,
  title,
  price,
  currency,
  city,
  aiEnhanced,
  featured,
}) => {
  const typeLabel =
    type === "gold" ? "ذهب" : type === "silver" ? "فضة" : "ساعة";
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-3">
      <div className="w-14 h-14 rounded-lg bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-[9px] text-slate-500">
        صورة
      </div>
      <div className="flex-1 flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-100">
            {title}
          </span>
          {featured && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/80 text-slate-950">
              مميز
            </span>
          )}
          {aiEnhanced && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
              AI
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center text-[11px] text-slate-400">
          <span>{typeLabel}</span>
          <span>•</span>
          <span>{jeweler}</span>
          <span>•</span>
          <span>{city}</span>
        </div>
      </div>
      <div className="text-right text-xs">
        <div className="text-amber-300 font-semibold">
          {price}{" "}
          <span className="text-[10px] text-slate-400">{currency}</span>
        </div>
        <button className="mt-1 px-2 py-1 rounded-lg border border-slate-700 hover:border-amber-400/60 hover:text-amber-200 transition text-[10px]">
          تفاصيل
        </button>
      </div>
    </div>
  );
};

const UploadProductModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<"upload" | "ai-processing" | "preview">(
    "upload"
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl text-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">
              إضافة منتج جديد
            </div>
            <div className="text-[11px] text-slate-400">
              سيتم تحسين صورة المنتج تلقائياً باستخدام الذكاء الاصطناعي.
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-slate-200 text-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {step === "upload" && (
          <div className="space-y-4">
            <div className="border border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-slate-900/60">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg">
                📷
              </div>
              <div className="text-[11px] text-slate-300">
                اسحب وأفلت صورة المنتج هنا أو اضغط للاختيار
              </div>
              <div className="text-[10px] text-slate-500">
                يفضّل خلفية بسيطة، الصورة سيتم تنظيفها وتحسينها تلقائياً
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  نوع المنتج
                </label>
                <select className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px]">
                  <option>ذهب</option>
                  <option>فضة</option>
                  <option>ساعة</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  المدينة
                </label>
                <input
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px]"
                  placeholder="مثال: إسطنبول"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                عنوان المنتج
              </label>
              <input
                className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px]"
                placeholder="مثال: طقم ذهب 21K تركي"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  السعر
                </label>
                <input
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px]"
                  placeholder="مثال: 2450"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  العملة
                </label>
                <select className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px]">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>TRY</option>
                  <option>SAR</option>
                </select>
              </div>
            </div>

            <button
              className="w-full mt-1 py-2 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition"
              onClick={() => setStep("ai-processing")}
            >
              متابعة وبدء تحسين الصورة بالـ AI
            </button>
          </div>
        )}

        {step === "ai-processing" && (
          <div className="space-y-4 py-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-400/60 border-t-transparent animate-spin" />
            <div className="text-[11px] text-slate-200 text-center">
              يتم الآن تنظيف الخلفية، تحسين الإضاءة، وزيادة وضوح تفاصيل الذهب/الفضة...
            </div>
            <div className="text-[10px] text-slate-500 text-center">
              في التطبيق الحقيقي سيتم الاتصال بخدمة AI لمعالجة الصورة قبل حفظها.
            </div>
            <button
              className="mt-3 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-400/60 hover:text-amber-200 text-[11px]"
              onClick={() => setStep("preview")}
            >
              متابعة إلى المعاينة
            </button>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="text-[11px] text-slate-300">
              معاينة سريعة للصورة بعد التحسين (Wireframe فقط):
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="border border-dashed border-slate-700 rounded-xl p-2 flex flex-col items-center gap-2 bg-slate-900/60">
                <div className="w-full h-24 rounded-lg bg-slate-800 flex items-center justify-center">
                  قبل
                </div>
                <span className="text-slate-400">الصورة الأصلية</span>
              </div>
              <div className="border border-emerald-500/50 rounded-xl p-2 flex flex-col items-center gap-2 bg-slate-900/60">
                <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 flex items-center justify-center">
                  بعد (محسّنة)
                </div>
                <span className="text-emerald-300">
                  محسّنة بالذكاء الاصطناعي
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-[11px] text-slate-300"
                onClick={() => setStep("upload")}
              >
                رجوع
              </button>
              <button
                className="px-3 py-1.5 rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 text-[11px] font-semibold"
                onClick={onClose}
              >
                نشر المنتج (وهمي)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
