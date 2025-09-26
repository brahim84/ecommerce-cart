import Marquee from "react-fast-marquee";

const PromoMarquee = () => {
  return (
    <Marquee
      speed={40}
      gradient={false}
      pauseOnHover={true}
      style={{
        background: "#ffe066",
        color: "#222",
        fontWeight: "bold",
        fontSize: "1.1em",
        padding: "10px 0"
      }}
    >
      Good News! Auckland customer! Buy two remotes or more and get delivery and programming absolutely free..
    </Marquee>
  );
}
export default PromoMarquee;
