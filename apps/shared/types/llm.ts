export type ContactContext = {
    [email: string]: {
      name: string;
      title?: string;
    };
  };
  
  export type CrmContext = {
    dealId?: string;
    accountId?: string;
    dealStage?: string;
  };
  
  export type Deal = {
    id: string;          // UUID → stacksync_record_id_rr1kp8
    hubspotId: string;   // ✅ Numeric HubSpot deal ID (e.g. "97496164039")
    name: string;
    stage: string;
    amount?: string;
    closeDate?: string;
  };

  export type ContextData = {
    contact: {
      id: string;
      name: string;
      email: string;
      companyName?: string;
    };
    deals: Deal[];
  };