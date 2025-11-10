"""Add email verification fields

Revision ID: add_email_verification
Revises: 
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'add_email_verification'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add new columns
    op.add_column('users', sa.Column('is_email_verified', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('users', sa.Column('email_verification_token', sa.String(), nullable=True))
    
    # Update existing users to be verified (for backward compatibility)
    op.execute("UPDATE users SET is_email_verified = true WHERE role = 'admin'")

def downgrade():
    op.drop_column('users', 'email_verification_token')
    op.drop_column('users', 'is_email_verified')