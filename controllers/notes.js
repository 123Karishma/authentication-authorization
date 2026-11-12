const Notes = require("../models/notes")
async function handleNotes(req, res) {

    const { title, content } = req.body;

    await Notes.create({
        title,
        content,
        userId: req.user.id,
    });

    res.redirect("/home");
}
async function getNotes(req, res) {
    console.log("GET NOTES CONTROLLER HIT");

    const findNotes = await Notes.find({
        userId: req.user.id,
    });

    console.log("findNotes =", findNotes);

    res.render("home/home", { findNotes })
}

async function notesUpdatebyId(req, res) {
    const { title, content } = req.body;
    await Notes.findByIdAndUpdate(req.params.id, {
        title,
        content

    })
    res.redirect("/home");
}

async function notesUpdatedGet(req, res) {
    const note = await Notes.findById(req.params.id);
    res.render("home/edit", {
        note,
    });
}

async function noteDelete(req, res) {
    const deleteNotes = await Notes.findByIdAndDelete(req.params.id)

    res.redirect("/home");

}


async function searchQuery(req, res) {
    const searchQuery = req.query.q; // Captures the 'q' parameter from the URL
       console.log("searchQuery",searchQuery)
    const userId = req.user.id
    if (!searchQuery) {
        const notes = await Notes.findOne({})
        console.log("notes",notes)
        if(!notes){
            console.log("not found")
        }

        return res.json(notes);
    }
    // Filter products by checking if the name includes the search term (case-insensitive)
    const results = await Notes.find({ userId: userId, title: { $regex: searchQuery, $options: 'i' } });
    console.log("results",results)
    res.json(results);
     // Return the matching results
}


async function paginationNotes(req, res) {
    // 1. Get params, set defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    // 2. Calculate skip
    const skipIndex = (page - 1) * limit;

    try {


        const totalNotes = await Notes.countDocuments({
            userId: req.user.id,
        });

        const notes = await Notes.find({
            userId: req.user.id,
        })
            .sort({ createdAt: -1 })
            .skip(skipIndex)
            .limit(limit);

        // 4. Return data + metadata
        res.render("home/home", {
            findNotes: notes,
            page,
            limit,
            hasNextPage: page * limit < totalNotes,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleNotes,
    getNotes,
    notesUpdatebyId,
    noteDelete,
    notesUpdatedGet,
    searchQuery,
    paginationNotes
}