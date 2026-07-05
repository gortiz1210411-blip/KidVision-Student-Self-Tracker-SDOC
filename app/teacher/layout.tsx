export const metadata = {
  title: "Teacher Phase Pending | KidVision",
  description: "Teacher tools are not part of the current district review build.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
