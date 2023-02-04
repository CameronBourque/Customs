import firebaseApp from "firebase.js";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import {logDebug, logError} from "../logger.js";

const db = getFirestore(firebaseApp);

// Check if the guild exists in the database
export async function guildExists(gID) {
    try {
        const q = query(collection(db, "guilds"), where("gID", "==", parseInt(gID)))
        const snap = await getDocs(q)
        return snap.docs.length > 0;
    } catch (err) {
        logError(err)
    }

    return false
}

// Create the guild in the database
export async function createGuild(gID, gName = '') {
    try {
        await setDoc(doc(db, "guilds", gID), {
            gName: gName,
            user: {},
            games: {},
            team1Role: '',
            team2Role: '',
            defaultRole: '',
            captainRole: '',
            draftRole: ''
        })
        logDebug("Created document for guild " + gID)
        return StatusCode.Success
    } catch(err) {
        logError(err)
    }
    return StatusCode.BadFail
}

// Getter and setter functions for roles
export async function setTeam1Role(gID, role) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            team1Role: role
        })

        return (await getDoc(doc(db, 'guilds', gID))).data().team1Role === role
    } catch(err) {
        logError(err)
    }

    return false
}

export async function getTeam1Role(gID) {
    try {
        return (await getDoc(doc(db, 'guilds', gID))).data().team1Role
    } catch (err) {
        logError(err)
    }

    return false
}

export async function setTeam2Role(gID, role) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            team2Role: role
        })

        return (await getDoc(doc(db, 'guilds', gID))).data().team2Role === role
    } catch(err) {
        logError(err)
    }

    return false
}

export async function getTeam2Role(gID) {
    try {
        return (await getDoc(doc(db, 'guilds', gID))).data().team2Role
    } catch (err) {
        logError(err)
    }

    return false
}

export async function setDefaultRole(gID, role) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            defaultRole: role
        })

        return (await getDoc(doc(db, 'guilds', gID))).data().defaultRole === role
    } catch(err) {
        logError(err)
    }

    return false
}

export async function getDefaultRole(gID) {
    try {
        return (await getDoc(doc(db, 'guilds', gID))).data().defaultRole
    } catch (err) {
        logError(err)
    }

    return false
}

export async function setCaptainRole(gID, role) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            captainRole: role
        })

        return (await getDoc(doc(db, 'guilds', gID))).data().captainRole === role
    } catch(err) {
        logError(err)
    }

    return false
}

export async function getCaptainRole(gID) {
    try {
        return (await getDoc(doc(db, 'guilds', gID))).data().captainRole
    } catch (err) {
        logError(err)
    }

    return false
}

export async function setDraftRole(gID, role) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            draftRole: role
        })

        return (await getDoc(doc(db, 'guilds', gID))).data().draftRole === role
    } catch(err) {
        logError(err)
    }

    return false
}

export async function getDraftRole(gID) {
    try {
        return (await getDoc(doc(db, 'guilds', gID))).data().draftRole
    } catch (err) {
        logError(err)
    }

    return false
}

// Update role name
export async function updateRole(gID, oldRole, newRole) {
    try {
        const gDoc = doc(db, 'guilds', gID)
        if(await getTeam1Role(gID) === oldRole) {
            await setTeam1Role(gID, newRole)
            return StatusCode.Success
        } else if(await getTeam2Role(gID) === oldRole) {
            await setTeam2Role(gID, newRole)
            return StatusCode.Success
        } else if(await getDraftRole(gID) === oldRole) {
            await setDraftRole(gID, newRole)
            return StatusCode.Success
        } else if(await getCaptainRole(gID) === oldRole) {
            await setCaptainRole(gID, newRole)
            return StatusCode.Success
        } else if(await getDefaultRole(gID) === oldRole) {
            await setDefaultRole(gID, newRole)
            return StatusCode.Success
        }
        return StatusCode.GraceFail
    } catch (err) {
        logError(err)
    }

    return StatusCode.BadFail
}

// Delete a role
export async function removeRole(gID, role) {
    return await updateRole(gID, role, "")
}
