const API = "http://localhost:5000";

export const apiAlerts = {
  async getAlerts() {
    const res = await fetch(`${API}/api/alerts`);
    return res.json();
  },

  async addAlert(alert: any) {
    const res = await fetch(`${API}/api/alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alert),
    });
    return res.json();
  },

  async acknowledgeAlert(id: string) {
    await fetch(`${API}/api/alerts/${id}/acknowledge`, { method: "PUT" });
  },

  async resolveAlert(id: string) {
    await fetch(`${API}/api/alerts/${id}/resolve`, { method: "PUT" });
  },

  async deleteAlert(id: string) {
    await fetch(`${API}/api/alerts/${id}`, { method: "DELETE" });
  }
};
