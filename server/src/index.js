const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());


app.get('/api/proposals', async (req, res) => {
    try {
        const externalApiUrl = 'https://namada-indexer.kintsugi-nodes.com/proposals';
        const response = await axios.get(externalApiUrl);
        const proposalsData = response.data;
        
        res.json(proposalsData);
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/proposal/:id', async (req, res) => {
  try {
      const { id } = req.params; 
      const ApiDetailUrl = `https://namada-indexer.kintsugi-nodes.com/proposal/${id}`;
      const response = await axios.get(ApiDetailUrl);
      const proposalID = response.data;
      
      res.json(proposalID);
  } catch (error) {
      console.error('Error fetching data from external API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/proposal/vote/:id', async (req, res) => {
  try {
      const { id } = req.params; 
      const ApiDetailIDUrl = `http://164.68.105.164:443/proposal_result/${id}`;
      const response = await axios.get(ApiDetailIDUrl);
      const proposalDetailID = response.data;
      
      res.json(proposalDetailID);
  } catch (error) {
      console.error('Error fetching data from external API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/all-proposals', async (req, res) => {
    try {
        const ApiAllUrl = `https://namada.lankou.org/all_proposals.json`;
        const response = await axios.get(ApiAllUrl);
        const proposalDetailID = response.data;
        
        res.json(proposalDetailID);
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/detail/proposal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ApiAllUrl = `https://namada.lankou.org/all_proposals.json`;
        const response = await axios.get(ApiAllUrl);
        const allProposals = response.data;
        const proposalDetail = allProposals[id];

        if (proposalDetail) {
            res.json(proposalDetail);
        } else {
            res.status(404).json({ error: 'Proposal not found' });
        }
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/test/proposal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const externalApiUrl = `https://explorer.node75.org/namada/proposals/${id}`;
        const response = await axios.get(externalApiUrl);
        const proposalsData = response.data;
        
        res.json(proposalsData);
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
