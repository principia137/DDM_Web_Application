# Generated by Django 3.1.4 on 2021-01-28 15:23

import ddm.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ddm', '0009_auto_20210126_0014'),
    ]

    operations = [
        migrations.AlterField(
            model_name='library',
            name='files',
            field=models.FileField(null=True, upload_to=ddm.models.get_file_path),
        ),
    ]
