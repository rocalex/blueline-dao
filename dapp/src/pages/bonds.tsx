import { BOND_ABI } from "@/abis/bond";
import DefaultLayout from "@/components/DefaultLayout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount, useContract, useSigner } from "wagmi";

export default function BondsPage() {
  const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const bond = useContract({
    address: process.env.NEXT_PUBLIC_BOND_CONTRACT,
    abi: BOND_ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    (async () => {
      if (bond && address) {
        const owner = await bond.owner();
        if (owner != address) {
          router.push("/");
        }
      }
    })();
  }, [address, bond, router]);

  return (
    <DefaultLayout>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <div className="field">
                <div className="buttons">
                  <button className="button">Issue Bond</button>
                  <button className="button">Set escrow</button>
                  <button className="button">Withdraw</button>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Face Value</th>
                    <th>Coupon Rate</th>
                    <th>Maturity Date</th>
                    <th>Issuer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                </tbody>
              </table>
              <nav
                className="pagination"
                role="navigation"
                aria-label="pagination"
              >
                <ul className="pagination-list">
                  <li>
                    <a className="pagination-link is-current">1</a>
                  </li>
                  <li>
                    <a className="pagination-link">2</a>
                  </li>
                  <li>
                    <a className="pagination-link">3</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
