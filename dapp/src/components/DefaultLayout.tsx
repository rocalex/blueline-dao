import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useContract, useSigner } from "wagmi";
import { AUTH_ABI } from "@/abis/auth";
import { BOND_ABI } from "@/abis/bond";

interface LayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: LayoutProps) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOwner, setOwner] = useState(false);

  const { address } = useAccount();
  const { data: signer } = useSigner();

  const auth = useContract({
    address: process.env.NEXT_PUBLIC_AUTH_CONTRACT,
    abi: AUTH_ABI,
    signerOrProvider: signer,
  });

  const bond = useContract({
    address: process.env.NEXT_PUBLIC_BOND_CONTRACT,
    abi: BOND_ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    (async () => {
      if (auth && address) {
        const flag = await auth.checkIsUserLogged(address);
        setLoggedIn(flag);
      }
    })();
  }, [address, auth]);

  useEffect(() => {
    (async () => {
      if (bond && address) {
        const owner = await bond.owner();
        setOwner(owner == address);
      }
    })();
  }, [address, bond]);

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <Link href={"/"} className="navbar-item">
              <strong>Blueline DAO</strong>
            </Link>
          </div>
          <div className="navbar-menu">
            <div className="navbar-start">
              {isOwner && (
                <Link href={"/bonds"} className="navbar-item">
                  Bonds
                </Link>
              )}
              {loggedIn && (
                <>
                  <Link href={"/marketplace"} className="navbar-item">
                    Marketplace
                  </Link>
                  <Link href={"/investment"} className="navbar-item">
                    Investment
                  </Link>
                </>
              )}
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  {!loggedIn && (
                    <>
                      <Link href={"/register"} className="button is-primary">
                        <strong>Sign up</strong>
                      </Link>
                      <Link href={"/login"} className="button is-light">
                        Log in
                      </Link>
                    </>
                  )}
                  <ConnectKitButton showAvatar={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
};

export default DefaultLayout;
