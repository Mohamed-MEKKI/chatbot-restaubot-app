import ProjectController from "../project-controller/controller";




test('it should retrieve data from the database', async()=>{
    const projectController = new ProjectController();
    const items = await projectController.getAllItems("menuitem");
    console.log(items)
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
})

test('it should create data in the database', async()=>{
    const projectController = new ProjectController();
    const jsonfile = {
        "id": 18,
        "name": "Pizza al tartufo",
        "cuisine": "Italian",
        "description": "it a pizza with truffle and mozzarella",
        "price": "19.99",
        "rating": "5",
        "inventory_status": "In Stock",
        "created_at": "2025-08-12T10:00:00Z",
        "updated_at": "2025-08-12T10:00:00Z"
    }
    const response = await projectController.createItem(jsonfile)
    expect(response.status).toBe(201);
})

test('it should delete data from the database', async()=>{
    const projectController = new ProjectController();
    const response = await projectController.deleteItem(18)
    expect(response.status).toBe(204);
})