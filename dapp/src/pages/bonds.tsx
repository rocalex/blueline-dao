import { BOND_ABI } from "@/abis/bond";
import DefaultLayout from "@/components/DefaultLayout";
import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_INFURA_PID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const BondForm = () => {
  const [fileUrl, updateFileUrl] = useState("");

  const handleChange = async (e: any) => {
    const file = e.currentTarget.files[0];
    try {
      const added = await client.add(file);
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      updateFileUrl(url);
      console.log("IPFS URI: ", url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  return (
    <form>
      <div className="field">
        <label className="label">Document</label>
        <div className="control">
          <input type="file" onChange={handleChange} />
        </div>
      </div>
    </form>
  );
};

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
