const fs = require('fs');
const path = require('path');
const p = path.join('D:', 'inzozimarket-frontend', 'context', 'AppContext.tsx');
let content = fs.readFileSync(p, 'utf-8');

// 1. Add imports
content = content.replace(
  'import { createCampaignApi, createApplicationApi, fetchUserCampaignsApi } from "@/lib/campaignApi";',
  'import { createCampaignApi, createApplicationApi, fetchUserCampaignsApi, fetchCreatorOffersApi, BackendApplication, createOfferApi, respondToOfferApi } from "@/lib/campaignApi";'
);

// 2. Add refreshProposals
const refreshProposalsCode = `  const refreshProposals = async () => {
    try {
      const result = await fetchCreatorOffersApi();
      if (!result.ok) {
        console.warn("Could not fetch proposals:", result.message);
        return;
      }
      const apps = result.data ?? [];
      const mapped = apps.map((app) => ({
        id: app.id,
        businessId: app.campaign?.businessId ?? app.campaignId,
        businessName: app.campaign?.businessId ? (businesses.find(b => b.id === app.campaign?.businessId)?.name ?? "Business") : "Business",
        creatorId: app.creatorId,
        creatorName: app.creator?.name ?? "",
        title: app.campaign?.title ?? "Campaign Offer",
        details: app.proposal ?? "",
        budget: app.campaign?.budget ?? 0,
        status:
          app.status === "PENDING"
            ? "pending_creator"
            : app.status === "ACCEPTED"
              ? "accepted"
              : "declined",
        contractCreated: app.status === "ACCEPTED",
        messages: [],
      }));
      setProposals(mapped);
      localStorage.setItem("inzozi_proposals", JSON.stringify(mapped));
    } catch (err) {
      console.warn("refreshProposals error", err);
    }
  };`;

content = content.replace('  useEffect(() => {', refreshProposalsCode + '\n\n  useEffect(() => {');

// 3. Update useEffect to call refreshProposals
content = content.replace(
  'await refreshDirectMessages(); // load real conversations from backend',
  'await refreshDirectMessages(); // load real conversations from backend\n        await refreshProposals();'
);

// 4. Update launchCampaignProposal
const launchPattern = /const launchCampaignProposal = \([\s\S]*?addNotification\(`Campaign proposal sent to \${creatorName}.`\);\n  };/m;
const newLaunch = `const launchCampaignProposal = async (
    creatorId: string,
    title: string,
    details: string,
    budget: number
  ) => {
    if (!currentUser) return;
    if (businessBalance < budget) {
      addNotification("Failed to send proposal: Insufficient funds for escrow deposit.");
      return;
    }
    const campaignRes = await createCampaignApi({ title, description: details, budget });
    if (!campaignRes.ok || !campaignRes.data?.id) {
      addNotification(\`Failed to create campaign: \${campaignRes.message ?? "Unknown error"}\`);
      return;
    }
    const offerRes = await createOfferApi(campaignRes.data.id, creatorId, details);
    if (offerRes.ok) {
      await refreshProposals();
      const creatorName = creators.find((c) => c.id === creatorId)?.name ?? creatorId;
      addNotification(\`Campaign offer sent to \${creatorName} successfully.\`);
      const newBal = businessBalance - budget;
      setBusinessBalance(newBal);
      localStorage.setItem("inzozi_businessBalance", newBal.toString());
      saveTransactions([{ id: "tx_escrow_" + Date.now(), type: "campaign_escrow", amount: budget, description: \`Escrow deposit for campaign: \${title}\`, date: new Date().toISOString().split("T")[0] }]);
    } else {
      addNotification(\`Campaign created but offer failed: \${offerRes.message ?? "Error"}\`);
    }
  };`;
content = content.replace(launchPattern, newLaunch);

// 5. Update respondToProposal
const respondPattern = /const respondToProposal = async \([\s\S]*?addNotification\(`Sponsorship proposal \${action}ed.`\);\n  };/m;
const newRespond = `const respondToProposal = async (proposalId: string, action: "accept" | "decline") => {
    try {
      const responseAction = action === "accept" ? "ACCEPTED" : "DECLINED";
      const res = await respondToOfferApi(proposalId, responseAction);
      if (!res.ok) throw new Error(res.message || "Failed to respond to offer");
      await refreshProposals();
      if (action === "accept") {
        const prop = proposals.find(p => p.id === proposalId);
        if (prop) {
          const commission = prop.budget * 0.05;
          const netPayout = prop.budget - commission;
          const newCreatorBal = creatorBalance + netPayout;
          setCreatorBalance(newCreatorBal);
          localStorage.setItem("inzozi_creatorBalance", newCreatorBal.toString());
          const newAdminBal = adminBalance + commission;
          setAdminBalance(newAdminBal);
          localStorage.setItem("inzozi_adminBalance", newAdminBal.toString());
          saveTransactions([{ id: "tx_pay_" + Date.now(), type: "campaign_payout", amount: netPayout, description: \`Campaign payout: \${prop.title}\`, date: new Date().toISOString().split("T")[0] }]);
        }
      }
      addNotification(\`Sponsorship proposal \${action}ed.\`);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };`;
content = content.replace(respondPattern, newRespond);

fs.writeFileSync(p, content);
console.log('Successfully updated AppContext.tsx!');
