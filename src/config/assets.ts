
// --- D-ID CONFIGURATION ---
export const CONFIG = {
  did: {
    apiKey: process.env.NEXT_PUBLIC_DID_API_KEY || "",
    defaultVoice: "en-US-AriaNeural"
  }
};

// --- LEGACY ASSETS SUPPORT (For DidAvatar) ---
export const ASSETS = {
  avatar: {
    idleVideo: "/assets/Frank-Ai.mp4"
  }
};

// --- FULL ASSET LIBRARY (SOTA EPHEMERAL UI) ---
export const ASSET_LIBRARY = {
  png: [
    "/assets/images/image_0147636f-82cb-423f-921f-3f3ad6239c53.png",
    "/assets/images/image_021aa72c-ebcd-493f-808f-94b1fb5d70f6.png",
    "/assets/images/image_07324e37-07bd-429f-bf03-13dfd835310f.png",
    "/assets/images/image_07d98852-d8c9-4b35-9e60-8e12720b2340.png",
    "/assets/images/image_0816f987-47a9-4e01-bd27-302076cb9fcd.png",
    "/assets/images/image_0beffe6f-9ea1-42e1-89ac-86a9760579b1.png",
    "/assets/images/image_123dadb6-44da-49af-9a06-e021f799ea37.png",
    "/assets/images/image_1a4c86ec-5d0c-43ad-af24-d44ea8fd41e1.png",
    "/assets/images/image_2229035e-4e47-4f61-aaab-9b3f7fd01c60.png",
    "/assets/images/image_2e59a91b-f21b-40fb-bab6-366baf0ee478.png",
    "/assets/images/image_30c92b85-1dbc-46be-877c-163729bc492a.png",
    "/assets/images/image_3468c0ca-fd10-4b9e-8194-2d15d760b4c2.png",
    "/assets/images/image_3914e645-e8cc-476e-8a17-879be08efc45.png",
    "/assets/images/image_3bc14686-4f15-477f-ad98-e2ba374adab7.png",
    "/assets/images/image_4fcbd5d8-6330-4dea-889c-c6fd8fa5edfd.png",
    "/assets/images/image_58d941de-f60b-4a06-b565-3355e64b1f2f.png",
    "/assets/images/image_5bb6fe33-4369-4d9f-a744-177be4227b0e.png",
    "/assets/images/image_5d682718-b4fc-4475-811e-074a8b59767b.png",
    "/assets/images/image_5f075b5c-63bd-4aed-bc09-bb48915e7af1.png",
    "/assets/images/image_6ab9b3be-e826-45bf-a849-abec514ad28a.png",
    "/assets/images/image_6d7ea6f8-aaff-4f1d-bde9-9864174441f0.png",
    "/assets/images/image_72eb1b5d-9854-430a-912c-17c1db4bd1b1.png",
    "/assets/images/image_7a704a5d-34d7-454b-9129-f0b9b722e25a.png",
    "/assets/images/image_82c09d61-a159-48b8-9d45-940a01c3cf58.png",
    "/assets/images/image_89cbc6fc-4dd7-424f-a01f-0ddb2b82fdf5.png",
    "/assets/images/image_915ed22d-f4b3-477b-9e95-9dcef1a67354.png",
    "/assets/images/image_94ea2622-3549-46c9-b7c8-2d5ae315c21c.png",
    "/assets/images/image_99c4b832-0936-4f04-8cda-3a072eb1a7d8.png",
    "/assets/images/image_9bf9a846-29b3-4aca-a925-651266bb0577.png",
    "/assets/images/image_a90b1037-0c03-47bd-a5e0-994cffc2ee9a.png",
    "/assets/images/image_ab7b92a2-e390-413f-af2a-01e1501290cf.png",
    "/assets/images/image_ac30fd2c-6692-46ff-a0bd-92dddf2155fa.png",
    "/assets/images/image_b4d1fc7f-c387-4da5-aa35-1f5aaa8cbc0e.png",
    "/assets/images/image_c3328498-9040-405f-9495-21fa2dc3fc47.png",
    "/assets/images/image_cc7139b0-a599-43d1-8af3-30da4083d0eb.png",
    "/assets/images/image_ccbb50ea-f733-4cf7-bf7f-259a5611f761.png",
    "/assets/images/image_d6955475-87a7-48f3-95f6-09c39d5cae2a.png",
    "/assets/images/image_dc2ff3db-c845-4e33-ba9d-82a90b0a4986.png",
    "/assets/images/image_de4c672e-4922-435c-95b7-716fc2b8463f.png",
    "/assets/images/image_e1ce5728-89fa-4407-a09e-f4b8c81db189.png",
    "/assets/images/image_e289fe26-c25e-4098-a9ee-2dfd856bbb61.png",
    "/assets/images/image_e34d9c00-fe0e-40d8-95a3-caaa79dc6677.png",
    "/assets/images/image_e401465d-51bb-4c24-a174-085c4f1eee02.png",
    "/assets/images/image_eb93ac91-4675-44de-8a76-1cce3d253ef6.png",
    "/assets/images/image_ede753fd-6555-4b1e-9ba1-6d77a3082920.png",
    "/assets/images/image_fac91dd5-882d-410b-9a55-9bdd46af8a2e.png"
  ],
  svg: [
    "/assets/images/image_0147636f-82cb-423f-921f-3f3ad6239c53.svg",
    "/assets/images/image_021aa72c-ebcd-493f-808f-94b1fb5d70f6.svg",
    "/assets/images/image_07324e37-07bd-429f-bf03-13dfd835310f.svg",
    "/assets/images/image_07d98852-d8c9-4b35-9e60-8e12720b2340.svg",
    "/assets/images/image_0816f987-47a9-4e01-bd27-302076cb9fcd.svg",
    "/assets/images/image_0beffe6f-9ea1-42e1-89ac-86a9760579b1.svg",
    "/assets/images/image_123dadb6-44da-49af-9a06-e021f799ea37.svg",
    "/assets/images/image_1a4c86ec-5d0c-43ad-af24-d44ea8fd41e1.svg",
    "/assets/images/image_2229035e-4e47-4f61-aaab-9b3f7fd01c60.svg",
    "/assets/images/image_2559b521-92e2-4f0e-a76c-34bf6cb21f36.svg",
    "/assets/images/image_2e59a91b-f21b-40fb-bab6-366baf0ee478.svg",
    "/assets/images/image_30c92b85-1dbc-46be-877c-163729bc492a.svg",
    "/assets/images/image_3468c0ca-fd10-4b9e-8194-2d15d760b4c2.svg",
    "/assets/images/image_3914e645-e8cc-476e-8a17-879be08efc45.svg",
    "/assets/images/image_3bc14686-4f15-477f-ad98-e2ba374adab7.svg",
    "/assets/images/image_4fcbd5d8-6330-4dea-889c-c6fd8fa5edfd.svg",
    "/assets/images/image_58d941de-f60b-4a06-b565-3355e64b1f2f.svg",
    "/assets/images/image_5bb6fe33-4369-4d9f-a744-177be4227b0e.svg",
    "/assets/images/image_5d682718-b4fc-4475-811e-074a8b59767b.svg",
    "/assets/images/image_5f075b5c-63bd-4aed-bc09-bb48915e7af1.svg",
    "/assets/images/image_5fbe6e3d-bb2d-4632-a094-eaeeb9fd1c4b.svg",
    "/assets/images/image_6ab9b3be-e826-45bf-a849-abec514ad28a.svg",
    "/assets/images/image_6d7ea6f8-aaff-4f1d-bde9-9864174441f0.svg",
    "/assets/images/image_72eb1b5d-9854-430a-912c-17c1db4bd1b1.svg",
    "/assets/images/image_7a704a5d-34d7-454b-9129-f0b9b722e25a.svg",
    "/assets/images/image_82c09d61-a159-48b8-9d45-940a01c3cf58.svg",
    "/assets/images/image_89cbc6fc-4dd7-424f-a01f-0ddb2b82fdf5.svg",
    "/assets/images/image_915ed22d-f4b3-477b-9e95-9dcef1a67354.svg",
    "/assets/images/image_94ea2622-3549-46c9-b7c8-2d5ae315c21c.svg",
    "/assets/images/image_99c4b832-0936-4f04-8cda-3a072eb1a7d8.svg",
    "/assets/images/image_9bf9a846-29b3-4aca-a925-651266bb0577.svg",
    "/assets/images/image_a90b1037-0c03-47bd-a5e0-994cffc2ee9a.svg",
    "/assets/images/image_ab7b92a2-e390-413f-af2a-01e1501290cf.svg",
    "/assets/images/image_ac30fd2c-6692-46ff-a0bd-92dddf2155fa.svg",
    "/assets/images/image_b4d1fc7f-c387-4da5-aa35-1f5aaa8cbc0e.svg",
    "/assets/images/image_c3328498-9040-405f-9495-21fa2dc3fc47.svg",
    "/assets/images/image_cc7139b0-a599-43d1-8af3-30da4083d0eb.svg",
    "/assets/images/image_ccbb50ea-f733-4cf7-bf7f-259a5611f761.svg",
    "/assets/images/image_d6955475-87a7-48f3-95f6-09c39d5cae2a.svg",
    "/assets/images/image_dc2ff3db-c845-4e33-ba9d-82a90b0a4986.svg",
    "/assets/images/image_de4c672e-4922-435c-95b7-716fc2b8463f.svg",
    "/assets/images/image_e1ce5728-89fa-4407-a09e-f4b8c81db189.svg",
    "/assets/images/image_e289fe26-c25e-4098-a9ee-2dfd856bbb61.svg",
    "/assets/images/image_e34d9c00-fe0e-40d8-95a3-caaa79dc6677.svg",
    "/assets/images/image_e401465d-51bb-4c24-a174-085c4f1eee02.svg",
    "/assets/images/image_eb93ac91-4675-44de-8a76-1cce3d253ef6.svg",
    "/assets/images/image_ede753fd-6555-4b1e-9ba1-6d77a3082920.svg",
    "/assets/images/image_fac91dd5-882d-410b-9a55-9bdd46af8a2e.svg"
  ],
  pdf: [
    "/assets/images/image_0147636f-82cb-423f-921f-3f3ad6239c53.pdf",
    "/assets/images/image_021aa72c-ebcd-493f-808f-94b1fb5d70f6.pdf",
    "/assets/images/image_07d98852-d8c9-4b35-9e60-8e12720b2340.pdf",
    "/assets/images/image_0816f987-47a9-4e01-bd27-302076cb9fcd.pdf",
    "/assets/images/image_1a4c86ec-5d0c-43ad-af24-d44ea8fd41e1 (1).pdf",
    "/assets/images/image_1a4c86ec-5d0c-43ad-af24-d44ea8fd41e1.pdf",
    "/assets/images/image_2229035e-4e47-4f61-aaab-9b3f7fd01c60.pdf",
    "/assets/images/image_2e59a91b-f21b-40fb-bab6-366baf0ee478.pdf",
    "/assets/images/image_5f075b5c-63bd-4aed-bc09-bb48915e7af1.pdf",
    "/assets/images/image_6ab9b3be-e826-45bf-a849-abec514ad28a.pdf",
    "/assets/images/image_6d7ea6f8-aaff-4f1d-bde9-9864174441f0.pdf",
    "/assets/images/image_72eb1b5d-9854-430a-912c-17c1db4bd1b1.pdf",
    "/assets/images/image_89cbc6fc-4dd7-424f-a01f-0ddb2b82fdf5.pdf",
    "/assets/images/image_915ed22d-f4b3-477b-9e95-9dcef1a67354.pdf",
    "/assets/images/image_94ea2622-3549-46c9-b7c8-2d5ae315c21c.pdf",
    "/assets/images/image_ab7b92a2-e390-413f-af2a-01e1501290cf.pdf",
    "/assets/images/image_ac30fd2c-6692-46ff-a0bd-92dddf2155fa.pdf",
    "/assets/images/image_b4d1fc7f-c387-4da5-aa35-1f5aaa8cbc0e.pdf",
    "/assets/images/image_cc7139b0-a599-43d1-8af3-30da4083d0eb.pdf",
    "/assets/images/image_ccbb50ea-f733-4cf7-bf7f-259a5611f761.pdf",
    "/assets/images/image_dc2ff3db-c845-4e33-ba9d-82a90b0a4986.pdf",
    "/assets/images/image_de4c672e-4922-435c-95b7-716fc2b8463f.pdf",
    "/assets/images/image_e34d9c00-fe0e-40d8-95a3-caaa79dc6677.pdf",
    "/assets/images/image_e401465d-51bb-4c24-a174-085c4f1eee02.pdf",
    "/assets/images/image_fac91dd5-882d-410b-9a55-9bdd46af8a2e.pdf"
  ]
};

// Aliases for compatibility
export const ALL_ASSETS = ASSET_LIBRARY.png;

export const ASSET_BUNDLES = {
  analysis: ASSET_LIBRARY.png.slice(0, 10),
  design: ASSET_LIBRARY.png.slice(10, 20),
  diagnose: ASSET_LIBRARY.png.slice(20, 30),
  scenery: ASSET_LIBRARY.png.slice(30, 40)
};
