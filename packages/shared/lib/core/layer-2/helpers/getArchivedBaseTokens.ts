const URL =
  "https://archive.evm.shimmer.shimmer.network/v1/chains/smr1prxvwqvwf7nru5q5xvh5thwg54zsm2y4wfnk6yk56hj3exxkg92mx20wl3s/core/accounts/account/{address}/balance";

interface Response {
  baseTokens: number;
}

export async function getArchivedBaseTokens(address: string): Promise<number> {
  const url = URL.replace("{address}", address);
  try {
    const res: Response = await fetch(url)
      .then((r) => r.json());

    return res.baseTokens;
  } catch (_) {
    return 0;
  }
}
