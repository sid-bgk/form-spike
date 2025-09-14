module.exports = {
  submit: (req, res) => {
    try {
      // Log the incoming submission for now
      // eslint-disable-next-line no-console
      console.log('[submit:react-hook-form] payload:', JSON.stringify(req.body));
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to process submission', details: e instanceof Error ? e.message : String(e) });
    }
  },
};