import { AUTH_ABI } from "@/abis/auth";
import DefaultLayout from "@/components/DefaultLayout";
import { Contract } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const provider = useProvider();

  const auth: Contract | null = useContract({
    address: process.env.NEXT_PUBLIC_AUTH_CONTRACT,
    abi: AUTH_ABI,
    signerOrProvider: signer,
  });

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();

      const gasPrice = await provider.getGasPrice();
      const txn = await auth?.registerUser(address, username, password, {
        gasPrice,
      });

      await txn.wait();

      router.push("/login");
    },
    [auth, username, password, address, provider, router]
  );

  return (
    <DefaultLayout>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-half">
              <form method="post" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">username</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.currentTarget.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">password</label>
                  <div className="control">
                    <input
                      className="input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button className="button">Sign Up</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default RegisterPage;
