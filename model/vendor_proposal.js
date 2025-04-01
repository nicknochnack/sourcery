const db = require("./knex")();
const { v4: uuidv4 } = require("uuid");

class VendorProposal {
  static async create(rfpId, vendorId, status = "pending") {
    const [proposal] = await db("vendor_proposal")
      .insert({
        id: uuidv4(),
        rfp_id: rfpId,
        vendor_id: vendorId,
        status,
      })
      .returning("*");
    return proposal;
  }

  static async findById(id) {
    return db("vendor_proposal").where({ id }).first();
  }

  static async getByRfp(rfpId) {
    return db("vendor_proposal")
      .where({ rfp_id: rfpId })
      .join("vendor", "vendor_proposal.vendor_id", "vendor.id")
      .select(
        "vendor_proposal.*",
        "vendor.*",
        "vendor_proposal.id as id",
        "vendor.id as vendor_id"
      )
      .orderBy("vendor_proposal.date_created", "desc");
  }

  static async getByVendor(vendorId) {
    return db("vendor_proposal")
      .where({ vendor_id: vendorId })
      .orderBy("date_created", "desc");
  }

  static async update(id, updates) {
    const [updated] = await db("vendor_proposal")
      .where({ id })
      .update(updates)
      .returning("*");
    return updated;
  }

  static async delete(id) {
    const trx = await db.transaction();

    try {
      // Delete all associated responses first
      await trx("rfp_response").where({ vendor_proposal_id: id }).del();

      // Then delete the proposal
      const deleted = await trx("vendor_proposal").where({ id }).del();

      await trx.commit();
      return deleted;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

module.exports = VendorProposal;
