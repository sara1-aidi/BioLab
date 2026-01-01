import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import NotificationDrawer from '../patient/components/NotificationDrawer';
export const Navigation = () => {
    return(
        <nav className="bg-[var(--background)] border-b border-[var(--foreground)]/10">
            <div className="max-w-7xl mx-auto ps-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrinf-0">
                        <h1 className="text-xl font-semibold text-[var(--foreground)]">
                            Laboratory Website
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <SignInButton mode="modal" />
                        <UserButton />
                        {/*<SignOutButton />*/}
                        <NotificationDrawer />
                    </div>
                </div>
            </div>
        </nav>
    );
};