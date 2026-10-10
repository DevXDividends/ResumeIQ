from fastapi import APIRouter, HTTPException

from app import database as db
from app.schemas import AdminLoginRequest, AdminLoginResponse, AdminCreateRequest, AdminOut

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=AdminLoginResponse)
def login(payload: AdminLoginRequest):
    """Ported from LoginForAdmin.py."""
    if db.verify_admin(payload.username, payload.password):
        return AdminLoginResponse(success=True, message="Login successful!")
    raise HTTPException(status_code=401, detail="Invalid username or password")


@router.get("/admins", response_model=list[AdminOut])
def list_admins():
    """Ported from ADD or Del ADMIN.py get_all_admins_db()."""
    return [AdminOut(username=u) for u in db.get_all_admins()]


@router.post("/admins", response_model=AdminOut, status_code=201)
def create_admin(payload: AdminCreateRequest):
    """Ported from ADD or Del ADMIN.py add_admin_db()."""
    if not payload.username or not payload.password:
        raise HTTPException(status_code=400, detail="Please enter both username and password!")
    success = db.add_admin(payload.username, payload.password)
    if not success:
        raise HTTPException(status_code=409, detail="Username already exists!")
    return AdminOut(username=payload.username)


@router.delete("/admins/{username}")
def remove_admin(username: str):
    """Ported from ADD or Del ADMIN.py delete_admin_db()."""
    db.delete_admin(username)
    return {"success": True, "message": f"Admin '{username}' deleted successfully"}
