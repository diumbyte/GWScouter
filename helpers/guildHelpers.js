const crypto = require('crypto');

module.exports = async (db) => {
        // Ensure no collisions
        let newInviteLink;
        let collisionCheck;
        
        do {
            newInviteLink = crypto.randomBytes(4).toString('hex');
            
            collisionCheck = await db('guilds')
            .select("invite")
            .where({
                invite: newInviteLink
            })
            .first();
        } while(collisionCheck)

        return newInviteLink;
}